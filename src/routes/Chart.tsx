import React from 'react';
import {useOutletContext} from "react-router-dom";
import {useQuery} from "react-query";
import {fetchCoinHistory} from "../api";
import ApexChart from 'react-apexcharts'
import {useRecoilValue} from "recoil";
import {isDarkAtom} from "../atoms";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 40px;

  .apexcharts-tooltip {
    background: whitesmoke;
    color: #000;
  }
`

interface IHistorical {
    time_open: string
    time_close: string
    open: number
    high: number
    low: number
    close: number
    volume: number
    market_cap: number
    map: any
    slice: any
}

interface IChartProps {
    coinId?: string
}

const Chart = ({coinId}: IChartProps) => {
    const isDark = useRecoilValue(isDarkAtom)
    const {
        isLoading, data
    } = useQuery<IHistorical>(["ohlcv", coinId], () => fetchCoinHistory(coinId))
    return (
        <Container>{isLoading ? "Loading Chart..." :
            <ApexChart
                type='candlestick'
                height={500}
                options={{
                    chart: {
                        type: 'candlestick',
                        height: 500,
                        foreColor: isDark ? '#fff' : '#000',
                    },
                    title: {
                        text: coinId,
                        align: 'left',
                    },
                    xaxis: {
                        type: 'datetime',
                    },
                    yaxis: {
                        tooltip: {
                            enabled: true,
                        },
                    },
                    tooltip: {
                        enabled: true,
                    },
                }}
                series={[{
                    data: data?.map((data: any) => {
                        const x = new Date(data.time_open)
                        const y = [data.open, data.high, data.low, data.close].map((item: any) => item.toFixed(2))
                        return {x, y}
                    }),
                }]}
            />}
        </Container>
    );
}

export default Chart;
