'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  title: string;
  content: string;
  image?: string;
}

interface AdminOnboardingProps {
  onClose?: () => void;
}

export default function AdminOnboarding({ onClose }: AdminOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Define the onboarding steps in Farsi
  const steps: OnboardingStep[] = [
    {
      title: "به پنل مدیریت دیما خوش آمدید",
      content: "در این راهنما، نحوه استفاده از پنل مدیریت منو را به شما آموزش خواهیم داد. شما می‌توانید آیتم‌های منو را مدیریت کنید، آنها را ویرایش کنید و آیتم‌های جدید اضافه کنید. این پنل به شما امکان می‌دهد محتوای متفاوتی برای منوهای فارسی و انگلیسی داشته باشید.",
    },
    {
      title: "مشاهده آیتم‌های منو",
      content: "در صفحه اصلی پنل مدیریت، می‌توانید تمام آیتم‌های منو را بر اساس دسته‌بندی مشاهده کنید. آیتم‌ها در بخش‌های مختلف مانند قهوه گرم، قهوه سرد، صبحانه و غیره گروه‌بندی شده‌اند. برای دیدن جزئیات هر آیتم، روی آن کلیک کنید.",
    },
    {
      title: "افزودن آیتم جدید",
      content: "برای افزودن آیتم جدید به منو، روی دکمه «افزودن آیتم جدید» در بالای صفحه کلیک کنید. فرم اضافه کردن آیتم جدید باز می‌شود که در آن می‌توانید تمام جزئیات آیتم را وارد کنید. به یاد داشته باشید که می‌توانید انتخاب کنید آیتم در کدام زبان‌ها (فارسی، انگلیسی یا هر دو) نمایش داده شود.",
    },
    {
      title: "ایجاد آیتم‌های مخصوص یک زبان",
      content: "یکی از قابلیت‌های مهم این سیستم، امکان ایجاد آیتم‌های مخصوص یک زبان است. برای مثال، اگر می‌خواهید آیتمی فقط در منوی فارسی نمایش داده شود، در بالای فرم، گزینه «نمایش در منوی فارسی» را فعال کنید و گزینه «نمایش در منوی انگلیسی» را غیرفعال کنید. به همین ترتیب، برای آیتم‌های مخصوص منوی انگلیسی عمل کنید. این قابلیت به شما امکان می‌دهد برای مشتریان هر زبان، منوی مخصوص و متناسب با فرهنگ آنها ارائه دهید.",
    },
    {
      title: "مثال: اسپرسو با دانه‌های مختلف",
      content: "به عنوان مثال، فرض کنید می‌خواهید ۴ نوع اسپرسو با دانه‌های مختلف در منوی فارسی داشته باشید (۱۰۰٪ عربیکا، ۶۰٪ عربیکا، ۳۰٪ عربیکا، و ۱۰۰٪ روبوستا) اما فقط ۲ نوع از آنها را در منوی انگلیسی نمایش دهید. برای این کار، ابتدا ۲ نوع مشترک را با فعال کردن هر دو گزینه «نمایش در منوی فارسی» و «نمایش در منوی انگلیسی» اضافه کنید. سپس، ۲ نوع دیگر را با فعال کردن فقط گزینه «نمایش در منوی فارسی» اضافه کنید. به این ترتیب، مشتریان فارسی‌زبان همه ۴ نوع را می‌بینند، اما مشتریان انگلیسی‌زبان فقط ۲ نوع اول را می‌بینند.",
    },
    {
      title: "ویژگی منوهای دو زبانه",
      content: "یکی از ویژگی‌های خاص این سیستم، پشتیبانی از محتوای متفاوت برای هر زبان است. می‌توانید آیتم‌هایی داشته باشید که فقط در منوی فارسی یا فقط در منوی انگلیسی نمایش داده می‌شوند. همچنین می‌توانید برای هر زبان، محتوا و قیمت‌های متفاوتی تعریف کنید. برای مثال، اسپرسو با دانه‌های مختلف می‌تواند گزینه‌های بیشتری در منوی فارسی نسبت به منوی انگلیسی داشته باشد.",
    },
    {
      title: "تنظیم قیمت‌ها",
      content: "در فرم افزودن یا ویرایش آیتم، می‌توانید قیمت‌های متفاوتی برای هر زبان تعیین کنید. فرمت قیمت انعطاف‌پذیر است و می‌توانید قیمت‌ها را به صورت ۳۵۰۰۰ / ۴۵۰۰۰ / ۶۰۰۰۰ برای نشان دادن چندین گزینه وارد کنید. این امکان به شما اجازه می‌دهد گزینه‌های قیمتی متفاوتی برای آیتم‌های مختلف در هر زبان داشته باشید.",
    },
    {
      title: "ویرایش آیتم‌ها",
      content: "برای ویرایش یک آیتم موجود، روی آیتم مورد نظر در لیست کلیک کنید و سپس دکمه «ویرایش» را انتخاب کنید. فرم ویرایش باز می‌شود که در آن می‌توانید هر یک از جزئیات آیتم را تغییر دهید. پس از انجام تغییرات، دکمه «ذخیره» را کلیک کنید.",
    },
    {
      title: "تنظیم موجود بودن آیتم‌ها",
      content: "برای هر آیتم، می‌توانید تعیین کنید که آیا در حال حاضر موجود است یا خیر. اگر گزینه «موجود» را غیرفعال کنید، آیتم با یک نشانگر «ناموجود» در منو نمایش داده می‌شود. این برای زمانی مفید است که یک آیتم به طور موقت تمام شده است اما نمی‌خواهید آن را کاملاً از منو حذف کنید.",
    },
    {
      title: "مدیریت مواد تشکیل‌دهنده",
      content: "برای هر آیتم، می‌توانید لیستی از مواد تشکیل‌دهنده در هر زبان اضافه کنید. مواد را با کاما از هم جدا کنید. برای مثال: «قهوه، شیر، شکر». این مواد در منوی نهایی برای مشتریان نمایش داده می‌شوند.",
    },
    {
      title: "حذف آیتم‌ها",
      content: "برای حذف یک آیتم از منو، روی آیتم مورد نظر کلیک کنید و سپس دکمه «حذف» را انتخاب کنید. یک پیام تأیید نمایش داده می‌شود. در صورت تأیید، آیتم به طور کامل از منو حذف می‌شود.",
    },
    {
      title: "بارگذاری تصاویر",
      content: "برای هر آیتم منو، می‌توانید یک تصویر اضافه کنید. می‌توانید URL تصویر را در فیلد مربوطه وارد کنید یا از ابزار بارگذاری تصویر استفاده کنید. تصاویر با کیفیت بالا و نسبت تصویر ۴:۳ بهترین نتیجه را ارائه می‌دهند.",
    },
    {
      title: "پایان راهنما",
      content: "تبریک می‌گوییم! شما اکنون آماده استفاده از پنل مدیریت منو هستید. اگر سوال یا مشکلی دارید، لطفاً با تیم پشتیبانی تماس بگیرید. از اینکه از سیستم مدیریت منوی دیما استفاده می‌کنید، متشکریم!",
    },
  ];

  const handleClose = () => {
    setShowOnboarding(false);
    // Optionally save to localStorage to not show again
    localStorage.setItem('adminOnboardingCompleted', 'true');
    if (onClose) {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 flex flex-col h-full" dir="rtl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {steps[currentStep].title}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="بستن"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {steps[currentStep].image && (
                  <div className="rounded-lg overflow-hidden h-48 relative">
                    <Image
                      src={steps[currentStep].image}
                      alt={steps[currentStep].title}
                      className="w-full h-full object-cover"
                      width={192}
                      height={256}
                    />
                  </div>
                )}
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {steps[currentStep].content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentStep + 1} از {steps.length}
              </span>
              <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full ml-3">
                <div
                  className="h-full bg-primary-600 rounded-full"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  قبلی
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {currentStep < steps.length - 1 ? 'بعدی' : 'پایان'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 