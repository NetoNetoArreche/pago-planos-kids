
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { planId } = await req.json()
    console.log('Creating subscription for user:', user.id, 'plan:', planId)

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      console.error('Plan error:', planError)
      return new Response(
        JSON.stringify({ error: 'Plano não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If it's a free plan, just create the subscription locally
    if (plan.type === 'free') {
      const { data: subscription, error: subError } = await supabaseClient
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (subError) {
        console.error('Subscription error:', subError)
        return new Response(
          JSON.stringify({ error: 'Erro ao criar assinatura' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, subscription }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For paid plans, create Mercado Pago subscription
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    if (!accessToken) {
      console.error('Missing Mercado Pago access token')
      return new Response(
        JSON.stringify({ error: 'Configuração de pagamento não encontrada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create preference for Mercado Pago
    const preference = {
      items: [
        {
          title: plan.name,
          description: plan.description,
          unit_price: plan.price,
          quantity: 1,
        }
      ],
      payer: {
        email: user.email,
      },
      back_urls: {
        success: `${req.headers.get('origin')}/dashboard?payment=success`,
        failure: `${req.headers.get('origin')}/dashboard?payment=failure`,
        pending: `${req.headers.get('origin')}/dashboard?payment=pending`,
      },
      auto_return: "approved",
      external_reference: `${user.id}_${planId}`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,
    }

    console.log('Creating MP preference:', preference)

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    const mpData = await mpResponse.json()
    console.log('MP response:', mpData)

    if (!mpResponse.ok) {
      console.error('Mercado Pago error:', mpData)
      return new Response(
        JSON.stringify({ error: 'Erro ao criar pagamento', details: mpData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create pending subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        status: 'pending',
        mercadopago_subscription_id: mpData.id,
      })
      .select()
      .single()

    if (subError) {
      console.error('Subscription error:', subError)
      return new Response(
        JSON.stringify({ error: 'Erro ao criar assinatura' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        init_point: mpData.init_point,
        subscription_id: subscription.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
