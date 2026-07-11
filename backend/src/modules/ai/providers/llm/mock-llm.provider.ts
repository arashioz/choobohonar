import { Injectable } from '@nestjs/common';
import { CompletionRequest, LLMProvider } from './llm.interface';

const MOCK_BLOG_FA = {
  title: 'انتخاب چوب برای دکوراسیون داخلی: راهنمای کاربردی',
  outline: [
    'مقدمه: چرا جنس چوب مهم است',
    'چوب ماسیو در برابر روکش و صفحات مهندسی',
    'گردو، بلوط و راش؛ تفاوت در رگه و دوام',
    'انتخاب بر اساس کاربرد و فضا',
    'پرداخت و نگهداری',
    'جمع‌بندی',
  ],
  body: `جنس چوب، بیش از ظاهر، تعیین‌کنندهٔ دوام و حسِ یک فضاست. انتخاب درست از همان ابتدا، سال‌ها بعد در پرداخت و کاربرد خودش را نشان می‌دهد.

**چوب ماسیو در برابر صفحات مهندسی**
چوب ماسیو رگه و گرمای طبیعی دارد و قابل بازپرداخت است؛ صفحات مهندسی مانند MDF و پلی‌وود پایداری ابعادی بهتری دارند و برای سطوح بزرگ و کابینت کاربردی‌ترند. انتخاب میان این دو، به کاربرد و بودجه بستگی دارد، نه به یک «بهترین» مطلق.

**گردو، بلوط و راش**
گردو رگهٔ تیره و عمیق دارد و برای قطعات شاخص مناسب است. بلوط محکم است و در برابر سایش دوام می‌آورد. راش روشن و یکدست است و خوب رنگ می‌پذیرد.

**انتخاب بر اساس کاربرد**
برای سطح پرکار مثل میز ناهارخوری، دوام و مقاومت اولویت دارد؛ برای قطعهٔ تزئینی، رگه و فرم. فضا و نور طبیعی هم در دیده‌شدن رنگ چوب نقش دارند.`,
  metaTitle: 'انتخاب چوب برای دکوراسیون داخلی | خانه چوب و هنر',
  metaDescription:
    'راهنمای کاربردی انتخاب چوب برای دکوراسیون داخلی: تفاوت چوب ماسیو و صفحات مهندسی، گردو و بلوط و راش، و انتخاب بر اساس کاربرد.',
  keywords: ['انتخاب چوب', 'چوب دکوراسیون', 'چوب ماسیو', 'چوب گردو', 'چوب بلوط', 'دکوراسیون داخلی'],
  marketingCopy: 'انتخاب درستِ چوب، از همان ابتدا در دوام دیده می‌شود.',
};

const MOCK_BLOG_EN = {
  title: 'Choosing Wood for Interior Design: A Practical Guide',
  outline: [
    'Introduction: why the wood itself matters',
    'Solid wood vs. veneer and engineered panels',
    'Walnut, oak and beech: grain and durability',
    'Choosing by use and space',
    'Finish and care',
    'Conclusion',
  ],
  body: `More than its looks, the wood you choose decides how a piece wears and how a room feels. A good choice at the start shows years later, in the finish and in everyday use.

**Solid wood vs. engineered panels**
Solid wood carries natural grain and warmth and can be refinished; engineered panels such as MDF and plywood hold their shape better and suit large surfaces and cabinetry. The choice between them follows the use and the budget, not an absolute "best".

**Walnut, oak and beech**
Walnut has a deep, dark grain and suits statement pieces. Oak is hard and stands up to wear. Beech is pale and even, and takes finish well.

**Choosing by use**
For a working surface like a dining table, durability comes first; for a decorative piece, grain and form lead. The space and its natural light also shape how the wood's colour reads.`,
  metaTitle: 'Choosing Wood for Interior Design | ChooboHonar Home',
  metaDescription:
    'A practical guide to choosing wood for interiors: solid wood vs. engineered panels, walnut, oak and beech, and how to choose by use.',
  keywords: ['choosing wood', 'interior design wood', 'solid wood', 'walnut', 'oak', 'wood décor'],
  marketingCopy: 'Choose the right wood at the start; you will see it in how it lasts.',
};

const MOCK_PRODUCT_FA = {
  title: 'میز ناهارخوری گردو ماسیو | خانه چوب و هنر',
  body: `صفحهٔ این میز از چوب گردو ماسیو ساخته شده و رگهٔ پیوستهٔ چوب در طول آن دیده می‌شود. پرداخت روغن طبیعی، بافت چوب را زیر دست محسوس نگه می‌دارد و قابل بازپرداخت است.

**مشخصات**
- جنس: چوب گردو ماسیو
- ابعاد: ۲۰۰ × ۱۰۰ × ۷۵ سانتی‌متر
- پرداخت: روغن طبیعی
- ظرفیت: ۸ نفر`,
  metaTitle: 'میز ناهارخوری گردو ماسیو | خانه چوب و هنر',
  metaDescription: 'میز ناهارخوری دست‌ساز از چوب گردو ماسیو با پرداخت روغن طبیعی. ابعاد ۲۰۰×۱۰۰، ظرفیت ۸ نفر.',
  keywords: ['میز گردو ماسیو', 'میز ناهارخوری چوبی', 'میز چوب گردو', 'مبلمان دست‌ساز', 'میز ۸ نفره'],
  marketingCopy: 'یک صفحهٔ گردو ماسیو، با رگه‌ای که در طول میز ادامه دارد.',
};

const MOCK_PRODUCT_EN = {
  title: 'Solid Walnut Dining Table | ChooboHonar Home',
  body: `The top is made from solid walnut, with the grain running unbroken along its length. A natural-oil finish keeps the wood's texture present under the hand and lets the surface be refinished over time.

**Specifications**
- Material: Solid walnut
- Dimensions: 200 × 100 × 75 cm
- Finish: Natural oil
- Capacity: Seats 8`,
  metaTitle: 'Solid Walnut Dining Table | ChooboHonar Home',
  metaDescription:
    'Handcrafted solid walnut dining table with a natural-oil finish. 200×100 cm, seats 8. Grain runs unbroken along the top.',
  keywords: ['solid walnut dining table', 'wooden dining table', 'handcrafted table', 'walnut furniture', 'seats 8 table'],
  marketingCopy: 'A solid walnut top, with the grain running the length of the table.',
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class MockLLMProvider implements LLMProvider {
  async complete(request: CompletionRequest): Promise<string> {
    // Simulate API latency
    await delay(800 + Math.floor(Math.random() * 400));

    const prompt = request.userPrompt.toLowerCase();
    const isFarsi = prompt.includes('fa') || prompt.includes('فارسی') || prompt.includes('persian');
    const isBlog = prompt.includes('blog') || prompt.includes('بلاگ') || prompt.includes('topic');
    const isProduct = prompt.includes('product') || prompt.includes('محصول');

    if (isBlog) {
      return JSON.stringify(isFarsi ? MOCK_BLOG_FA : MOCK_BLOG_EN);
    }
    if (isProduct) {
      return JSON.stringify(isFarsi ? MOCK_PRODUCT_FA : MOCK_PRODUCT_EN);
    }

    // Generic mock for individual steps
    if (prompt.includes('keyword') || prompt.includes('seo') || prompt.includes('کلیدواژه')) {
      return JSON.stringify({
        keywords: ['چوب ماسیو', 'دکوراسیون چوبی', 'مبلمان دست‌ساز', 'طراحی داخلی'],
        outline: ['مقدمه', 'موضوع اصلی', 'نتیجه‌گیری'],
      });
    }

    return JSON.stringify({ content: 'محتوای نمونهٔ خانه چوب و هنر (نسخهٔ آزمایشی)' });
  }
}
