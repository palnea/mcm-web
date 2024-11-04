import React, {useEffect, useRef, useState} from 'react';
import { useTranslation } from 'next-i18next';
import i18n from '../../../i18n';
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const { t, i18n } = useTranslation('common');

  // useEffect(() => {
  //   const handleLanguageChange = (lng) => {
  //     // Any additional side effect you want to perform on language change
  //     console.log(`Language changed to: ${lng}`);
  //   };
  //
  //   i18n.on('languageChanged', handleLanguageChange);
  //
  //   // Cleanup the listener on component unmount
  //   return () => {
  //     i18n.off('languageChanged', handleLanguageChange);
  //   };
  // }, [i18n]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const changeLanguage = (lng) => {
    console.log('Current language before change:', i18n.language);
    console.log('Available languages:', i18n.languages);
    i18n.changeLanguage(lng);
    console.log('Current language after change:', i18n.language);
    handleClose();
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
        <i className='tabler-language' />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-start'
        transition
        disablePortal
        className='min-is-[160px] !mbs-3 z-[1]'
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: 'right top' }}>
            <Paper className='border shadow-none'>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  <MenuItem key="en" onClick={() => changeLanguage("en")}>
                    English
                  </MenuItem>
                  <MenuItem key="tr" onClick={() => changeLanguage("tr")}>
                    Türkçe
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default LanguageSelector;
