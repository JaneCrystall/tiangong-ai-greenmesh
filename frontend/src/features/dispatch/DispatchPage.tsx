import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import {
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'
import { fetchDispatchGuardrails, fetchDispatchQueue } from '../../api/mockClient'

function DispatchPage() {
  const { data: queue = [] } = useQuery({
    queryKey: ['dispatch', 'queue'],
    queryFn: fetchDispatchQueue,
  })
  const { data: guardrails = [] } = useQuery({
    queryKey: ['dispatch', 'guardrails'],
    queryFn: fetchDispatchGuardrails,
  })

  const statusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'primary'
      case 'pending':
        return 'warning'
      case 'done':
        return 'success'
      default:
        return 'default'
    }
  }

  const riskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      default:
        return 'success'
    }
  }

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <PlayArrowRoundedIcon color="primary" />
          <Typography variant="h6">调度队列</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          调度链路遵循规则优先；支持互斥排队、速率限制与回退令牌。
        </Typography>
        <TableContainer sx={{ maxHeight: 420 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>范围</TableCell>
                <TableCell>动作</TableCell>
                <TableCell>开始</TableCell>
                <TableCell align="right">状态</TableCell>
                <TableCell align="right">风险</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queue.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{item.scope}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.target}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.action}</Typography>
                  </TableCell>
                  <TableCell>{item.start}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      color={statusColor(item.status)}
                      label={item.status === 'running' ? '执行中' : item.status === 'pending' ? '排队' : '完成'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" color={riskColor(item.risk)} label={`风险 ${item.risk}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Grid container spacing={2}>
        {guardrails.map((item) => (
          <Grid key={item.id} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: { xs: 2, md: 3 },
                height: '100%',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <SecurityRoundedIcon color="primary" />
                <Typography variant="subtitle1">{item.title}</Typography>
                <Chip
                  size="small"
                  color={item.state === 'active' ? 'success' : 'warning'}
                  label={item.state === 'active' ? '生效中' : '待发布'}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {item.detail}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 2, md: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <BoltRoundedIcon color="primary" />
        <Typography variant="subtitle2">安全兜底</Typography>
        <Chip label="双通道下发" variant="outlined" />
        <Chip label="令牌 + TTL 防重入" variant="outlined" />
        <Chip label="可回退到安全档位" variant="outlined" />
      </Paper>
    </Stack>
  )
}

export default DispatchPage
