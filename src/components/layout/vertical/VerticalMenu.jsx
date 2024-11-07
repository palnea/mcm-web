// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import {Menu, MenuItem, MenuSection, SubMenu} from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import {useTranslation} from "next-i18next";

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const { t } = useTranslation('common');


  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/dashboard' icon={<i className='tabler-layout-dashboard' />}>
          {t("dashboard")}
        </MenuItem>
        <MenuSection label={t("yahct")}/>
        <SubMenu label={t("yahcts")} icon={<i className='tabler-sailboat' />}>
          <MenuItem href={`/yacht/brand`} button={"secondary"}>
            {t("brands")}
          </MenuItem>
          <MenuItem href='/yacht/model'  button={"secondary"}>
            {t("model")}
          </MenuItem>
          <MenuItem href='/yacht/yacht'  button={"secondary"}>
            {t("yahcts")}
          </MenuItem>
        </SubMenu>

        <MenuItem href='/yacht-accessories' icon={<i className='tabler-playlist-add' />} button={"secondary"}>
          {t("yahctAccessories")}
        </MenuItem>
        <MenuSection label={t("spareParts")}/>

        <SubMenu label={t("spareParts")} icon={<i className='tabler-settings-plus' />}>
          <MenuItem href={`/categories`} button={"secondary"}>
            {t("categories")}
          </MenuItem>
          <MenuItem href='/yacht/someting'  button={"secondary"}>
            {t("spareParts")}
          </MenuItem>

        </SubMenu>
        <MenuSection label={t("company")}/>

        <MenuItem href='/team-statistics' icon={<i className='tabler-users-group' />} button={"secondary"}>
          {t("groupStatistics")}
        </MenuItem>

      </Menu>
      {/* <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <GenerateVerticalMenu menuData={menuData(dictionary)} />
        </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
