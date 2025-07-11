
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function PaymentStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    
    if (paymentStatus) {
      switch (paymentStatus) {
        case 'success':
          toast({
            title: "Pagamento Aprovado! 🎉",
            description: "Sua assinatura foi ativada com sucesso!",
          });
          break;
        case 'pending':
          toast({
            title: "Pagamento Pendente",
            description: "Seu pagamento está sendo processado. Você será notificado quando for aprovado.",
          });
          break;
        case 'failure':
          toast({
            title: "Pagamento Rejeitado",
            description: "Houve um problema com seu pagamento. Tente novamente.",
            variant: "destructive",
          });
          break;
      }

      // Remove payment status from URL
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  return null;
}
