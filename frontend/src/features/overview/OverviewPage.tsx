import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded'
import LanRoundedIcon from '@mui/icons-material/LanRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import {
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'
import { LineChart } from '@mui/x-charts/LineChart'
import { useTheme } from '@mui/material/styles'
import {
  fetchAuditEvents,
  fetchOverviewMetrics,
  fetchOverviewTimeline,
} from '../../api/mockClient'
import type { OverviewMetric } from '../../api/mockClient'
import StatusCard from '../../components/StatusCard'

function OverviewPage() {
  const theme = useTheme()
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { data: metrics = [] } = useQuery<OverviewMetric[]>({
    queryKey: ['overview', 'metrics'],
    queryFn: fetchOverviewMetrics,
  })
  const { data: timeline = [] } = useQuery({
    queryKey: ['overview', 'timeline'],
    queryFn: fetchOverviewTimeline,
  })
  const { data: events = [] } = useQuery({
    queryKey: ['overview', 'events'],
    queryFn: fetchAuditEvents,
  })

  return (
    <Stack spacing={2}>
      <Grid container spacing={2} alignItems="stretch">
        {metrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatusCard
              title={metric.title}
              value={metric.value}
              helper={metric.helper}
              trend={metric.trend}
              status={metric.status}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 }, height: '100%' }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <TimelineRoundedIcon color="primary" />
              <Typography variant="h6">源-网-荷-储-充趋势</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2.5}>
              秒级采集，数据口径统一；功率、SoC、碳强度同轴展示便于对齐调度与核算。
            </Typography>
            <LineChart
              height={340}
              dataset={timeline}
              xAxis={[{ scaleType: 'point', dataKey: 'label' }]}
              yAxis={[
                { id: 'power', label: 'MW' },
                { id: 'soc', label: 'SoC %', position: 'right', min: 0, max: 100 },
                { id: 'carbon', label: 'kgCO₂/MWh', position: 'right' },
              ]}
              series={[
                {
                  id: 'power',
                  label: '功率 (MW)',
                  dataKey: 'powerMw',
                  yAxisId: 'power',
                  area: true,
                  color: theme.palette.success.main,
                  curve: 'monotoneX',
                  showMark: false,
                },
                {
                  id: 'soc',
                  label: 'SoC (%)',
                  dataKey: 'soc',
                  yAxisId: 'soc',
                  color: theme.palette.primary.main,
                  curve: 'monotoneX',
                  showMark: false,
                },
                {
                  id: 'carbon',
                  label: '碳强度',
                  dataKey: 'carbonIntensity',
                  yAxisId: 'carbon',
                  color: theme.palette.warning.main,
                  curve: 'monotoneX',
                  showMark: false,
                },
              ]}
              slotProps={{
                legend: { direction: 'horizontal', position: { vertical: 'top', horizontal: 'start' } },
              }}
              margin={{ top: 32, right: isSmDown ? 48 : 72, left: 56, bottom: 32 }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', p: { xs: 2, md: 3 }, height: '100%' }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <LanRoundedIcon color="primary" />
              <Typography variant="h6">最新事件/审计</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              调度令牌、通道状态与审批事件均留痕，可用于回放与追责。
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense>
              {events.map((event) => (
                <ListItem key={event.id} sx={{ px: 0, py: 0.5 }}>
                  <ListItemAvatar>
                    <Chip
                      size="small"
                      color={
                        event.result === 'success'
                          ? 'success'
                          : event.result === 'warning'
                            ? 'warning'
                            : 'error'
                      }
                      label={event.result === 'success' ? '成功' : event.result === 'warning' ? '关注' : '失败'}
                      icon={<EventAvailableRoundedIcon />}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2">{event.action}</Typography>
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
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FlashOnRoundedIcon color="primary" />
          <Typography variant="subtitle1">实时态势要点</Typography>
        </Stack>
        <Chip label="储能下发：速率限制开启" variant="outlined" />
        <Chip label="碳因子版本 v2025.01 生效中" variant="outlined" />
        <Chip label="北区 10kV 馈线：互斥策略排队" variant="outlined" />
      </Paper>
    </Stack>
  )
}

export default OverviewPage
