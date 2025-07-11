
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  type: 'free' | 'premium' | 'vip';
  price: number;
  description: string;
  features: string[];
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;

      setPlans(data || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
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

    // Aqui será a integração com Mercado Pago
    toast({
      title: "Redirecionando para pagamento",
      description: `Processando assinatura do plano ${plan.name}...`,
    });
    
    // Por enquanto, vamos para o dashboard
    navigate('/dashboard');
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.type === 'premium' ? 'border-primary border-2 shadow-lg scale-105' : ''}`}
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
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.type === 'premium' ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.type === 'free' ? 'Grátis' : 'Assinar Agora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
