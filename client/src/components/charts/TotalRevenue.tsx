import React from 'react'
import { useList } from '@pankod/refine-core';
import ReactApexChart from 'react-apexcharts';
import {Box,Typography, Stack} from "@pankod/refine-mui";
import { ArrowCircleUpRounded } from '@mui/icons-material';
import { TotalRevenueOptions, TotalRevenueSeries } from './chart.config';
const TotalRevenue = () => {
  return (
    <Box
      p={4}
      flex={1}
      bgcolor="#fcfcfc"
      id="chart"
      display="flex"
      borderRadius="15px"
      flexDirection="column"
    >
        <Typography fontSize={18} fontWeight={600} color="#11142d">
          Total Revenue
        </Typography>
        <Stack
        my="20px"
        direction="row"
        gap={4}
        flexWrap="wrap"
        >
          <Typography fontSize={20} fontWeight={700} color="#11142d">
            $465,789
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <ArrowCircleUpRounded sx={{fontSize : 25, color : "#475be8"}} />
            <Stack>
              <Typography fontSize={15}>
                0.8%
              </Typography>
              <Typography fontSize={15}>
                Than Last Month
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      <ReactApexChart 
        series={TotalRevenueSeries}
        type="bar"
        height={310}
        options={TotalRevenueOptions}
      />
    </Box>
  )
}

export default TotalRevenue