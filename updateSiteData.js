/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

let content = fs.readFileSync('src/data/siteData.ts', 'utf8');

// Add import if missing
if (!content.includes('import { supabase }')) {
  content = 'import { supabase } from "@/lib/supabase";\n' + content;
}

const getFuncStart = content.indexOf('export function getSiteData(): SiteData {');
const saveFuncEnd = content.indexOf('export function getPasscode(): string {');

if (getFuncStart !== -1 && saveFuncEnd !== -1) {
  const newFuncs = `export async function getSiteData(): Promise<SiteData> {
  const defaults = {
    hero: defaultHero,
    about: defaultAbout,
    services: defaultServices,
    executions: defaultExecutions,
    blogs: defaultBlogs,
    testimonials: defaultTestimonials,
    stats: defaultStats,
    whatWeDo: defaultWhatWeDo,
    threatsToStrengths: defaultThreatsToStrengths,
    clientele: defaultClientele,
  };

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .single();

    if (data && data.data) {
      const parsed = data.data;
      return {
        hero: parsed.hero || defaultHero,
        about: parsed.about || defaultAbout,
        services: parsed.services || defaultServices,
        executions: parsed.executions || defaultExecutions,
        blogs: parsed.blogs || defaultBlogs,
        testimonials: parsed.testimonials || defaultTestimonials,
        stats: parsed.stats || defaultStats,
        whatWeDo: parsed.whatWeDo || defaultWhatWeDo,
        threatsToStrengths: parsed.threatsToStrengths || defaultThreatsToStrengths,
        clientele: parsed.clientele || defaultClientele,
      };
    }
  } catch (err) {
    console.error('Error fetching from supabase:', err);
  }

  return defaults as SiteData;
}

export async function saveSiteData(data: SiteData): Promise<void> {
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, data });
    
    if (error) {
      console.error('Supabase error:', error);
    }
  } catch (err) {
    console.error('Error saving to supabase:', err);
  }
}

`;

  content = content.substring(0, getFuncStart) + newFuncs + content.substring(saveFuncEnd);
  fs.writeFileSync('src/data/siteData.ts', content);
  console.log('Successfully updated siteData.ts');
} else {
  console.log('Could not find function markers.');
}
