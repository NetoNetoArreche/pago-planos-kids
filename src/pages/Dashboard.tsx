import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Star, Zap, LogOut, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentStatus } from '@/components/PaymentStatus';

interface UserSubscription {
  id: string;
  plan: {
    name: string;
    type: 'free' | 'premium' | 'vip';
    price: number;
  };
  status: string;
  started_at: string;
  expires_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchUserSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          id,
          status,
          started_at,
          expires_at,
          plan:plans(name, type, price)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'free': return <Zap className="h-6 w-6" />;
      case 'premium': return <Star className="h-6 w-6" />;
      case 'vip': return <Crown className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
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

  const currentPlan = subscription?.plan || { name: 'Gratuito', type: 'free', price: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <PaymentStatus />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Badge variant={getBadgeVariant(currentPlan.type)}>
                <div className="flex items-center space-x-1">
                  {getIcon(currentPlan.type)}
                  <span>{currentPlan.name}</span>
                </div>
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Olá, {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getIcon(currentPlan.type)}
                <span>Plano Atual</span>
              </CardTitle>
              <CardDescription>
                {subscription ? 'Sua assinatura ativa' : 'Plano gratuito'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{currentPlan.name}</p>
                <p className="text-muted-foreground">
                  R$ {currentPlan.price.toFixed(2)}{currentPlan.price > 0 ? '/mês' : ''}
                </p>
                {subscription && (
                  <div className="text-sm text-muted-foreground">
                    <p>Status: {subscription.status}</p>
                    {subscription.expires_at && (
                      <p>Expira em: {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade de Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Upgrade</span>
              </CardTitle>
              <CardDescription>
                Desbloqueie recursos premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {currentPlan.type === 'free' 
                    ? 'Upgrade para Premium ou VIP'
                    : currentPlan.type === 'premium' 
                    ? 'Upgrade para VIP'
                    : 'Você já tem o plano máximo!'
                  }
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/plans')}
                  disabled={currentPlan.type === 'vip'}
                >
                  {currentPlan.type === 'vip' ? 'Plano Máximo' : 'Ver Planos'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos</CardTitle>
              <CardDescription>
                O que você pode fazer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentPlan.type === 'free' && (
                  <>
                    <p className="text-sm">✓ Acesso limitado</p>
                    <p className="text-sm">✓ Suporte básico</p>
                  </>
                )}
                {currentPlan.type === 'premium' && (
                  <>
                    <p className="text-sm">✓ Acesso completo</p>
                    <p className="text-sm">✓ Suporte prioritário</p>
                    <p className="text-sm">✓ Recursos premium</p>
                  </>
                )}
                {currentPlan.type === 'vip' && (
                  <>
                    <p className="text-sm">✓ Acesso total</p>
                    <p className="text-sm">✓ Suporte 24/7</p>
                    <p className="text-sm">✓ Recursos exclusivos</p>
                    <p className="text-sm">✓ Sem limites</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área de Conteúdo Premium */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentPlan.type === 'free' 
                  ? '🔒 Conteúdo Premium' 
                  : '🎉 Área Premium'
                }
              </CardTitle>
              <CardDescription>
                {currentPlan.type === 'free' 
                  ? 'Faça upgrade para acessar conteúdo exclusivo'
                  : 'Bem-vindo à área premium!'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentPlan.type === 'free' ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Este conteúdo está disponível apenas para assinantes Premium e VIP.
                  </p>
                  <Button onClick={() => navigate('/plans')}>
                    Ver Planos Premium
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🎊 Parabéns!</h3>
                  <p>Você tem acesso a todos os recursos premium:</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold">Recursos Avançados</h4>
                      <p className="text-sm text-muted-foreground">
                        Acesso completo a todas as funcionalidades
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <h4 className="font-semibold">Suporte Premium</h4>
                      <p className="text-sm text-muted-foreground">
                        Atendimento prioritário e personalizado
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
