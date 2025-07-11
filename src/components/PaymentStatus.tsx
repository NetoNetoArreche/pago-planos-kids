
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function PaymentStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const paymentId = searchParams.get('payment_id');
    const preferenceId = searchParams.get('preference_id');
    
    console.log('Payment status from URL:', {
      status: paymentStatus,
      paymentId,
      preferenceId
    });
    
    if (paymentStatus) {
      switch (paymentStatus) {
        case 'success':
          toast({
            title: "Pagamento Aprovado! 🎉",
            description: "Sua assinatura foi ativada com sucesso! Bem-vindo ao seu novo plano.",
            duration: 6000,
          });
          break;
        case 'pending':
          toast({
            title: "Pagamento Pendente ⏳",
            description: "Seu pagamento está sendo processado. Você será notificado quando for aprovado.",
            duration: 6000,
          });
          break;
        case 'failure':
          toast({
            title: "Pagamento Rejeitado ❌",
            description: "Houve um problema com seu pagamento. Verifique os dados do cartão e tente novamente.",
            variant: "destructive",
            duration: 8000,
          });
          break;
        default:
          console.log('Unknown payment status:', paymentStatus);
      }

      // Remove payment parameters from URL after showing notification
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('payment');
      newSearchParams.delete('payment_id');
      newSearchParams.delete('preference_id');
      newSearchParams.delete('collection_id');
      newSearchParams.delete('collection_status');
      newSearchParams.delete('payment_type');
      newSearchParams.delete('merchant_order_id');
      newSearchParams.delete('preference_id');
      newSearchParams.delete('site_id');
      newSearchParams.delete('processing_mode');
      newSearchParams.delete('merchant_account_id');
      
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  return null;
}
