import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded'
import LanRoundedIcon from '@mui/icons-material/LanRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import {
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchAuditEvents,
  fetchOverviewMetrics,
  fetchOverviewTimeline,
  OverviewMetric,
} from '../../api/mockClient'
import StatusCard from '../../components/StatusCard'

function OverviewPage() {
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

  const option: EChartsOption = useMemo(() => {
    const labels = timeline.map((item) => item.label)
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { data: ['功率 (MW)', 'SoC (%)', '碳强度'], top: 0 },
      grid: { top: 40, left: 40, right: 60, bottom: 30 },
      xAxis: { type: 'category', data: labels, boundaryGap: false },
      yAxis: [
        { type: 'value', name: 'MW' },
        { type: 'value', name: 'SoC %', min: 0, max: 100, position: 'right' },
        { type: 'value', name: 'kgCO₂/MWh', position: 'right', offset: 45 },
      ],
      series: [
        {
          name: '功率 (MW)',
          type: 'line',
          smooth: true,
          data: timeline.map((item) => item.powerMw),
          areaStyle: { opacity: 0.08 },
          showSymbol: false,
          itemStyle: { color: '#0f766e' },
        },
        {
          name: 'SoC (%)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: timeline.map((item) => item.soc),
          showSymbol: false,
          itemStyle: { color: '#2563eb' },
        },
        {
          name: '碳强度',
          type: 'bar',
          yAxisIndex: 2,
          data: timeline.map((item) => item.carbonIntensity),
          itemStyle: { color: '#f97316', opacity: 0.6 },
          barMaxWidth: 18,
        },
      ],
    }
  }, [timeline])

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
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
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', p: 2, height: '100%' }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <TimelineRoundedIcon color="primary" />
              <Typography variant="h6">源-网-荷-储-充趋势</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              秒级采集，数据口径统一；功率、SoC、碳强度同轴展示便于对齐调度与核算。
            </Typography>
            <ReactECharts
              option={option}
              style={{ height: 340, width: '100%' }}
              notMerge
              lazyUpdate
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', p: 2, height: '100%' }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <LanRoundedIcon color="primary" />
              <Typography variant="h6">最新事件/审计</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={1}>
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
