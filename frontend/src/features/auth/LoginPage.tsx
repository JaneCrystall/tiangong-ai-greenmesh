import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import { useNavigate, useLocation } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname || '/'
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')

  const mutation = useMutation({
    mutationFn: () => loginApi(username, password),
    onSuccess: (data) => {
      login(data)
      navigate(from, { replace: true })
    },
  })

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LockOpenRoundedIcon color="primary" />
              <Box>
                <Typography variant="h5">零碳调度平台</Typography>
                <Typography variant="body2" color="text.secondary">
                  规则优先 · 可解释 · 可追溯
                </Typography>
              </Box>
            </Stack>
            <TextField
              label="用户名"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              label="密码"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? '登录中...' : '登录'}
            </Button>
            {mutation.isError && (
              <Alert severity="error">登录失败，请检查用户名或密码</Alert>
            )}
            <Typography variant="caption" color="text.secondary">
              默认示例账号：admin / admin123（仅开发环境），上线前请接入真实认证。
            </Typography>
            <Typography variant="caption" color="text.secondary">
              未注册？请联系管理员开通。 <Link href="mailto:ops@example.com">ops@example.com</Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
