import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import WhatsAppFAB from '@/components/landing/WhatsAppFAB';
import { createClient } from '@/lib/supabase/server';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  let logoUrl = '';
  try {
    const { data } = await supabase.from('site_content').select('value_en').eq('key', 'logo_image').single();
    if (data?.value_en) {
      logoUrl = data.value_en;
    }
  } catch (e) {
    // Ignore error if table is missing
  }

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main>{children}</main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
