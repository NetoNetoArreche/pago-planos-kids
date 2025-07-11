
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Crown, Star, Zap, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type Plan = Tables<'plans'> & {
  features: string[];
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;

      const transformedPlans: Plan[] = (data || []).map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features as string[] : []
      }));

      setPlans(transformedPlans);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      setError('Não foi possível carregar os planos. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: Plan) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (plan.type === 'free') {
      toast({
        title: "Plano Gratuito",
        description: "Você já tem acesso ao plano gratuito!",
      });
      return;
    }

    setProcessingPlan(plan.id);
    setError(null);

    try {
      console.log('Initiating payment for plan:', plan.name);
      
      const { data, error } = await supabase.functions.invoke('create-mercadopago-subscription', {
        body: { planId: plan.id }
      });

      console.log('Payment response:', data);

      if (error) {
        console.error('Payment error:', error);
        throw new Error(error.message || 'Erro ao processar pagamento');
      }

      if (data.init_point) {
        console.log('Redirecting to Mercado Pago:', data.init_point);
        
        toast({
          title: "Redirecionando...",
          description: "Você será redirecionado para o Mercado Pago",
        });

        // Add a small delay to show the toast
        setTimeout(() => {
          window.location.href = data.init_point;
        }, 1000);
      } else if (data.success) {
        // For free plans or direct activation
        toast({
          title: "Sucesso!",
          description: `Plano ${plan.name} ativado com sucesso!`,
        });
        navigate('/dashboard');
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error: any) {
      console.error('Erro ao processar plano:', error);
      
      const errorMessage = error.message || 'Não foi possível processar a assinatura. Tente novamente.';
      setError(errorMessage);
      
      toast({
        title: "Erro no Pagamento",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'free': return <Zap className="h-8 w-8" />;
      case 'premium': return <Star className="h-8 w-8" />;
      case 'vip': return <Crown className="h-8 w-8" />;
      default: return <Zap className="h-8 w-8" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'premium': return 'default';
      case 'vip': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
          <p className="text-xl text-muted-foreground">
            Encontre o plano perfeito para suas necessidades
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={fetchPlans}
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Test Cards Info */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <CreditCard className="h-4 w-4" />
          <AlertDescription>
            <strong>Cartões de Teste:</strong> Use os cartões oficiais do Mercado Pago para testar:
            <ul className="mt-2 text-sm space-y-1">
              <li>• <strong>Visa:</strong> 4509 9535 6623 3704 (Nome: APRO)</li>
              <li>• <strong>Mastercard:</strong> 5031 7557 3453 0604 (Nome: APRO)</li>
              <li>• <strong>Amex:</strong> 3711 803032 57522 (Nome: APRO)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 ${
                plan.type === 'premium' 
                  ? 'border-primary border-2 shadow-lg scale-105' 
                  : processingPlan === plan.id 
                  ? 'ring-2 ring-primary ring-opacity-50' 
                  : ''
              }`}
            >
              {plan.type === 'premium' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {getIcon(plan.type)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/mês</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.type === 'premium' ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={processingPlan === plan.id}
                >
                  {processingPlan === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {plan.type === 'free' ? 'Ativando...' : 'Processando...'}
                    </>
                  ) : (
                    plan.type === 'free' ? 'Grátis' : 'Assinar Agora'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Problemas com o pagamento?</strong> Certifique-se de usar os cartões de teste oficiais do Mercado Pago. 
              Para pagamentos reais, use seus cartões normais.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
