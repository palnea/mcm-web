'use client'

// React Imports
import {useEffect, useState} from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import {useTranslation} from "react-i18next";
import LanguageSelector from "@components/LanguageDropdown/LanguageSelector";

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer'], null, ['en', 'tr'])),

  },
  };
}

const LoginV2 = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isClient, setIsClient] = useState(false);

  // Set up a client-only check to ensure text matches between server and client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/darkLogo.png'
  const lightIllustration = '/images/illustrations/auth/lightLogo.png'
  const borderedDarkIllustration = '/images/illustrations/auth/darkLogo.png'
  const borderedLightIllustration = '/images/illustrations/auth/lightLogo.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const { t, i18n } = useTranslation('common');
  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    let response;
    const params = {
      "username": username,
      "password": password
    }
    try {
      response = await axios.post('http://localhost:7153/api/Users/Login', params, {});
      secureLocalStorage.setItem('accessToken', response.data.data.accessToken);
      router.push('/dashboard');
    } catch (error){
      console.error('Error logging in:', error);
    }
  };

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  useEffect(() => {
    // Change language on mount if needed (for example, from localStorage)
    const savedLang = localStorage.getItem('language') || 'en';
    // i18n.changeLanguage(savedLang).then(r => console.log('Language changed to:', r) );
  }, [i18n]);

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-row justify-content-between'>
            <div className='flex flex-col gap-1 '>
              <Typography variant='h4'>{t("welcomeTo") +`${themeConfig.templateName}`}</Typography>
              <Typography>{t('pleaseSign-inToYourAccount')}</Typography>
            </div>
            <div  className='ml-auto'>
              <LanguageSelector />
            </div>
          </div>

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}
            className='flex flex-col gap-5'
          >
            <CustomTextField
              autoFocus
              fullWidth
              label={t('username')}
              placeholder={t('enterYourUsername')}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label={t('password')}
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant='contained' type='submit'>
              {t('login')}
            </Button>
            {/*<div className='flex justify-center items-center flex-wrap gap-2'>*/}
            {/*  <Typography>{t('New on our platform?')}</Typography>*/}
            {/*  <Typography component={Link} color='primary'>*/}
            {/*    {t('Create an account')}*/}
            {/*  </Typography>*/}
            {/*</div>*/}
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginV2
