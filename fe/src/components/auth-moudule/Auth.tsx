import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithCallback, signUpWithCallback } from '@Jade/components/auth-moudule/actions';
import CommonButton from '@Jade/core-design/input/CommonButton';
import Input from '@Jade/core-design/input/CommonInput';
import PasswordInput from '@Jade/core-design/input/PasswordInput';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Layers,
  Lock,
  Mail,
  Moon,
  Sun
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import * as yup from "yup";
import SplashScreen from '@Jade/components/loading/SplashScreen';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import i18n, { handleChangeLanguage } from "@Jade/i18n";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword?: string;
}

const buildLoginSchema = (t: TFunction<'auth'>) => yup.object().shape({
  email: yup.string().email(t('validation.invalidEmail')).required(t('validation.emailRequired')),
  password: yup.string().required(t('validation.passwordRequired')),
});

const buildSignupSchema = (t: TFunction<'auth'>) => yup.object().shape({
  email: yup.string().email(t('validation.invalidEmail')).required(t('validation.emailRequired')),
  password: yup.string().required(t('validation.passwordRequired')),
  confirmPassword: yup.string().required(t('validation.confirmRequired')).oneOf([yup.ref('password')], t('validation.passwordMismatch')),
});



export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get('redirectToPath');
  const context = useSessionContext();
  const isContextLoading = context.loading;
  const hasSession = !isContextLoading && context.doesSessionExist;
  const { t } = useTranslation('auth');

  const loginSchema = useMemo(() => buildLoginSchema(t), [t]);
  const signupSchema = useMemo(() => buildSignupSchema(t), [t]);
  const resolver = useMemo(() => yupResolver(isLogin ? loginSchema : signupSchema), [isLogin, loginSchema, signupSchema]);

  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset } = useForm<SignupForm>({
    resolver,
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })


  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);


  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  }

  useEffect(() => {
    reset({
      email: '',
      password: '',
      confirmPassword: '',
    });
  }, [isLogin, reset]);

  useEffect(() => {
    if (isContextLoading) return;
    if (hasSession) {
      navigate(redirect || "/", { replace: true });
    }
  }, [hasSession, isContextLoading, navigate, redirect]);

  const successCallback = () => {
    navigate(redirect || "/", { replace: true });
    setIsLoading(false);
  }

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    if (isLogin) {
      await signInWithCallback(data.email, data.password, successCallback);
    }
    else {
      await signUpWithCallback(data.email, data.password, successCallback);
    }
  };

  if (isContextLoading || hasSession) {
    return <SplashScreen />
  }

  const onSubmitHandler = handleSubmit(onSubmit);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 font-sans relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* --- Custom Animations Styles --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; /* Start hidden */
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>

      <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-500 ${isDark ? 'opacity-20' : 'opacity-60'}`}>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">

        <button
          onClick={handleChangeLanguage}
          className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 font-bold text-xs tracking-wide ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-gray-50'}`}
        >
          <Globe size={14} />
          <span>{i18n.language === 'en' ? 'EN' : 'VN'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-gray-50'}`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>


      <div className={`w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 animate-slide-up ${isDark ? 'shadow-black/50 bg-slate-900' : 'shadow-slate-200 bg-white'}`}>

        <div className="w-full md:w-5/12 bg-indigo-600 relative p-8 md:p-12 flex flex-col justify-between overflow-hidden text-white group">

          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full border-2 border-white transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full border-4 border-white transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"></div>
            <div className="absolute top-[30%] right-[-20px] w-24 h-24 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner transform transition-transform duration-500 group-hover:rotate-6">
              <Layers size={24} />
            </div>
            <h1 className="text-3xl font-bold mb-4 tracking-tight drop-shadow-md">
              {t('hero.title')}
            </h1>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-90 mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Feature List with hover effects */}
            <div className="space-y-3">
              {[
                { color: "text-blue-300", text: t('hero.features.analytics') },
                { color: "text-purple-300", text: t('hero.features.collaboration') },
                { color: "text-pink-300", text: t('hero.features.security') }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-medium text-indigo-50 hover:translate-x-2 transition-transform duration-300 cursor-default">
                  <CheckCircle2 size={18} className={feature.color} />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            {/* Company Information & Footer */}
            <div className="flex flex-col gap-4 p-4 bg-indigo-700/30 rounded-xl backdrop-blur-sm border border-indigo-500/20 hover:bg-indigo-700/40 transition-colors">
              <div className="text-xs text-indigo-100/90 leading-relaxed font-medium">
                <p>{t('hero.location')}</p>
                <p>{t('hero.address')}</p>
                <p className="mt-1 opacity-75">{t('hero.contact')}</p>
              </div>
              <div className="h-px bg-indigo-400/30 w-full"></div>
              <div className="flex gap-4 text-[10px] font-bold tracking-wide uppercase text-indigo-200">
                <a href="#" className="hover:text-white transition-colors">{t('hero.links.privacy')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('hero.links.terms')}</a>
                <a href="#" className="hover:text-white transition-colors">{t('hero.links.help')}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative">

          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-2 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isLogin ? t('heading.login') : t('heading.signup')}
              </h2>
              <p className={`text-sm transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isLogin ? t('heading.loginSub') : t('heading.signupSub')}
              </p>
            </div>

            {/* Tab Toggle */}
            <div className={`flex items-center p-1 rounded-xl mb-6 border transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isLogin ? (isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-gray-100') : 'text-slate-400 hover:text-slate-500'}`}
              >
                {t('tabs.login')}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${!isLogin ? (isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-gray-100') : 'text-slate-400 hover:text-slate-500'}`}
              >
                {t('tabs.signup')}
              </button>
            </div>

            {/* Animated Form Fields */}
            <form className="space-y-4" onSubmit={onSubmitHandler} key={isLogin ? 'login' : 'signup'}>

              <div className="animate-slide-up stagger-1">
                <Input
                  label={t('fields.email')}
                  placeholder={t('fields.email')}
                  icon={<Mail className="w-6 h-6 pt-1" />}
                  name="email"
                  register={register}
                  registerOptions={{ required: true }}
                  error={isDirty ? errors.email?.message : undefined}
                  expandOnError={false}
                />
              </div>

              <div className="animate-slide-up stagger-2">
                <PasswordInput
                  label={t('fields.password')}
                  placeholder={t('fields.password')}
                  icon={<Lock className="w-6 h-6 pt-1" />}
                  name="password"
                  register={register}
                  registerOptions={{ required: true }}
                  error={isDirty ? errors.password?.message : undefined}
                  expandOnError={false}
                />
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div className="animate-slide-up stagger-3">
                  <PasswordInput
                    label={t('fields.confirmPassword')}
                    placeholder={t('fields.confirmPassword')}
                    icon={<Lock className="w-6 h-6 pt-1" />}
                    name="confirmPassword"
                    register={register}
                    registerOptions={{ required: true }}
                    error={isDirty ? errors.confirmPassword?.message : undefined}
                    expandOnError={false}
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end animate-slide-up stagger-3">
                  <a href="#" className={`text-xs font-semibold hover:underline transition-colors ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {t('actions.recover')}
                  </a>
                </div>
              )}

              <div className="animate-slide-up stagger-4 group">
                <CommonButton
                  className="h-12"
                  type="submit" loading={isLoading} disabled={isLoading || !isValid} icon={<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />} iconPosition="right">
                  {isLogin ? t('actions.login') : t('actions.register')}
                </CommonButton>
              </div>
            </form>

            <div className="relative my-8 animate-slide-up stagger-4">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t transition-colors ${isDark ? 'border-slate-800' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <span className={`px-3 transition-colors ${isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>{t('actions.or')}</span>
              </div>
            </div>

            {/* Google Sign In Only */}
            <div className="animate-slide-up stagger-4">
              <CommonButton className="h-12 bg-slate-900! text-white! dark:bg-white! dark:text-slate-900!" type="button" icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              } iconPosition="left">
                <span className="font-semibold text-sm">{t('actions.google')}</span>
              </CommonButton>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
