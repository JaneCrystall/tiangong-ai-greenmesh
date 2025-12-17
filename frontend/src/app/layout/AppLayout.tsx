import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ColorModeContext } from '../theme'

const navItems = [
  { label: '态势总览', path: '/' },
  { label: '调度编排', path: '/dispatch' },
  { label: '碳核算', path: '/carbon' },
  { label: '审计追溯', path: '/audit' },
]

const resolveActivePath = (pathname: string) => {
  const sortedNav = [...navItems].sort((a, b) => b.path.length - a.path.length)

  for (const item of sortedNav) {
    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
      return item.path
    }
  }

  return '/'
}

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const activePath = resolveActivePath(location.pathname)
  const { toggleMode } = useContext(ColorModeContext)
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', backdropFilter: 'blur(10px)' }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              gap: 2,
              minHeight: { xs: 64, md: 72 },
              py: { xs: 1, md: 1.5 },
              flexWrap: 'wrap',
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  letterSpacing: -0.5,
                }}
              >
                GM
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  GreenMesh
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  零碳园区 · 源-网-荷-储-充
                </Typography>
              </Box>
            </Stack>

            <Tabs
              value={activePath}
              onChange={(_, value) => navigate(value)}
              textColor="primary"
              indicatorColor="primary"
              variant={isMdDown ? 'scrollable' : 'standard'}
              allowScrollButtonsMobile
              scrollButtons={isMdDown ? 'auto' : false}
              sx={{
                minHeight: 48,
                flex: 1,
                minWidth: 0,
                order: { xs: 3, md: 2 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.path}
                  label={item.label}
                  value={item.path}
                  sx={{ textTransform: 'none', fontWeight: 600, minHeight: 48 }}
                />
              ))}
            </Tabs>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="flex-end"
              flexWrap="wrap"
              rowGap={1}
              sx={{
                minWidth: { xs: '100%', md: 'auto' },
                order: { xs: 2, md: 3 },
              }}
            >
              <Chip label="规则兜底" color="success" variant="outlined" size="small" />
              <Chip label="可追溯" color="primary" variant="outlined" size="small" />
              <Chip label="DM8" icon={<StorageOutlinedIcon />} size="small" />
              <Tooltip title={isDark ? '切换到明亮模式' : '切换到深色模式'}>
                <IconButton size="small" color="inherit" onClick={toggleMode} aria-label="切换主题">
                  {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" component="main" sx={{ py: { xs: 2, md: 3 } }}>
        <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              elevation={0}
              sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 }, height: '100%' }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BoltRoundedIcon color="primary" />
                  <Typography variant="h5">实时态势 + 可控调度</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  秒级采集，规则优先，调度可回退；碳口径一致且可复盘。
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Chip label="源-网-荷-储-充覆盖" size="small" variant="outlined" />
                  <Chip label="多园区/多站点" size="small" variant="outlined" />
                  <Chip label="调度回退令牌" size="small" variant="outlined" />
                  <Chip label="碳口径一致" size="small" variant="outlined" />
                </Stack>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper
              elevation={0}
              sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 }, height: '100%' }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ShieldOutlinedIcon color="primary" />
                  <Typography variant="subtitle1">运行概览</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Chip label="在线园区 3" color="primary" />
                  <Chip label="设备正常 98.4%" color="success" variant="outlined" />
                  <Chip icon={<StorageOutlinedIcon />} label="DM8 联调" variant="outlined" />
                  <Chip icon={<ShieldOutlinedIcon />} label="策略版本 v2025.01" variant="outlined" />
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Outlet />
      </Container>
    </Box>
  )
}

export default AppLayout
