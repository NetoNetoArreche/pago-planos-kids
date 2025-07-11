
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Webhook received:', req.method, req.url)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) {
      console.error('Missing Mercado Pago access token')
      return new Response('Missing access token', { status: 500 })
    }

    // Parse webhook data
    const body = await req.json()
    console.log('Webhook body:', body)

    // Handle payment notifications
    if (body.type === 'payment') {
      const paymentId = body.data?.id
      if (!paymentId) {
        console.log('No payment ID in webhook')
        return new Response('OK', { status: 200 })
      }

      // Get payment details from Mercado Pago
      console.log('Fetching payment details for:', paymentId)
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })

      if (!paymentResponse.ok) {
        console.error('Error fetching payment:', paymentResponse.status)
        return new Response('Error fetching payment', { status: 500 })
      }

      const payment = await paymentResponse.json()
      console.log('Payment details:', payment)

      // Extract user and plan info from external_reference or metadata
      const externalRef = payment.external_reference
      const metadata = payment.metadata
      
      let userId: string
      let planId: string

      if (externalRef && externalRef.includes('_')) {
        [userId, planId] = externalRef.split('_')
      } else if (metadata) {
        userId = metadata.user_id
        planId = metadata.plan_id
      } else {
        console.error('Unable to extract user/plan info from payment')
        return new Response('OK', { status: 200 })
      }

      console.log('Processing payment for user:', userId, 'plan:', planId, 'status:', payment.status)

      // Update subscription based on payment status
      let subscriptionStatus = 'pending'
      let startedAt = null
      let expiresAt = null

      if (payment.status === 'approved') {
        subscriptionStatus = 'active'
        startedAt = new Date().toISOString()
        // Set expiration to 30 days from now
        const expDate = new Date()
        expDate.setDate(expDate.getDate() + 30)
        expiresAt = expDate.toISOString()
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        subscriptionStatus = 'cancelled'
      }

      // Update or create subscription
      const { data: existingSubscription } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('plan_id', planId)
        .eq('status', 'pending')
        .single()

      if (existingSubscription) {
        // Update existing subscription
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({
            status: subscriptionStatus,
            started_at: startedAt,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscription.id)

        if (updateError) {
          console.error('Error updating subscription:', updateError)
        } else {
          console.log('Subscription updated successfully')
        }
      } else {
        // Create new subscription
        const { error: createError } = await supabaseClient
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan_id: planId,
            status: subscriptionStatus,
            started_at: startedAt,
            expires_at: expiresAt,
            mercadopago_subscription_id: payment.id.toString(),
          })

        if (createError) {
          console.error('Error creating subscription:', createError)
        } else {
          console.log('Subscription created successfully')
        }
      }
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500 })
  }
})
