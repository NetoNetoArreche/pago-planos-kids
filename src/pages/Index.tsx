
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/plans');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">MercadoPago App</h1>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Olá, {user.email}
                </span>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/plans')}>
                  Ver Planos
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Desbloqueie o Poder dos
          <span className="text-primary"> Planos Premium</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Escolha o plano perfeito para suas necessidades e tenha acesso a recursos exclusivos
          com integração completa ao Mercado Pago.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
            {user ? 'Ir para Dashboard' : 'Começar Agora'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/plans')} className="text-lg px-8 py-6">
            Ver Planos
          </Button>
        </div>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Nossos Planos</h3>
          <p className="text-muted-foreground">
            Escolha o plano ideal para você
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>Gratuito</CardTitle>
              <CardDescription>Perfeito para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">R$ 0</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Acesso limitado</li>
                <li>✓ Suporte básico</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center border-primary border-2 shadow-lg">
            <CardHeader>
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Premium</CardTitle>
              <CardDescription>Mais popular</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">R$ 29,90</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Acesso completo</li>
                <li>✓ Suporte prioritário</li>
                <li>✓ Recursos premium</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Crown className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <CardTitle>VIP</CardTitle>
              <CardDescription>Máximo desempenho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">R$ 59,90</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Acesso total</li>
                <li>✓ Suporte 24/7</li>
                <li>✓ Recursos exclusivos</li>
                <li>✓ Sem limites</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary/5 rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h3>
          <p className="text-muted-foreground mb-8">
            Junte-se a milhares de usuários satisfeitos
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
            {user ? 'Acessar Dashboard' : 'Criar Conta Grátis'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
