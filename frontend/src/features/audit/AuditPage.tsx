import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import {
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchAuditEvents } from '../../api/mockClient'

function AuditPage() {
  const { data: events = [] } = useQuery({
    queryKey: ['audit', 'events'],
    queryFn: fetchAuditEvents,
  })

  const colorFor = (result: string) => {
    if (result === 'success') return 'success'
    if (result === 'warning') return 'warning'
    return 'error'
  }

  return (
    <Stack spacing={2}>
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 } }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <HistoryRoundedIcon color="primary" />
          <Typography variant="h6">审计时间线</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          所有调度命令、配置变更、因子切换均留痕，可按时间或令牌检索并回放。
        </Typography>
        <List>
          {events.map((event, index) => (
            <Stack key={event.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        color={colorFor(event.result)}
                        label={event.result === 'success' ? '成功' : event.result === 'warning' ? '需关注' : '失败'}
                      />
                      <Typography variant="subtitle1">{event.action}</Typography>
                      <Chip size="small" variant="outlined" label={event.scope} />
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {event.at} · {event.actor}
                    </Typography>
                  }
                />
              </ListItem>
              {index < events.length - 1 && <Divider />}
            </Stack>
          ))}
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 2, md: 3 },
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <ShieldOutlinedIcon color="primary" />
        <Typography variant="subtitle2">审计与留痕</Typography>
        <Chip label="调度令牌 + 哈希" variant="outlined" />
        <Chip label="审批与回放 API" variant="outlined" />
        <Chip label="异常自动停机/回退" variant="outlined" />
        <Chip label="可对接外部审计" variant="outlined" />
      </Paper>

      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 } }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <AssignmentTurnedInRoundedIcon color="primary" />
          <Typography variant="h6">验收提示</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          验收关注：1) 调度/核算口径一致；2) 规则兜底可回退；3) 审计日志可检索、可导出、可复算。
        </Typography>
      </Paper>
    </Stack>
  )
}

export default AuditPage
