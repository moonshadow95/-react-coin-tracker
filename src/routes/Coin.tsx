import React from "react";
import {useLocation, useParams, useMatch, useNavigate} from "react-router";
import styled from "styled-components";
import {useQuery} from "react-query";
import {fetchCoinInfo, fetchCoinPrice} from "../api";
import {Helmet} from "react-helmet-async";
import Chart from "./Chart";

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 16px 32px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0;
  line-height: 1.4rem;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 40px;
  padding: 8px 14px;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border-color: #fff;
  cursor: pointer;
  color: #fff
`

interface RouteParams {
    coinId?: string
}

interface RouteState {
    state: {
        name: string
    }
}

interface IInfo {
    id: string
    name: string
    symbol: string
    rank: number
    is_new: boolean
    is_active: boolean
    type: string
    description: string
    message: string
    open_source: boolean
    started_at: string
    development_status: string
    hardware_wallet: boolean
    proof_type: string
    org_structure: string
    hash_algorithm: string
    first_data_at: string
    last_data_at: string
}

interface IPrice {
    id: string
    name: string
    symbol: string
    rank: number
    circulating_supply: number
    total_supply: number
    max_supply: number
    beta_value: number
    first_data_at: string
    last_updated: string
    quotes: {
        USD: {
            ath_date: string
            ath_price: number
            market_cap: number
            market_cap_change_24h: number
            percent_change_1h: number
            percent_change_1y: number
            percent_change_6h: number
            percent_change_7d: number
            percent_change_12h: number
            percent_change_15m: number
            percent_change_24h: number
            percent_change_30d: number
            percent_change_30m: number
            percent_from_price_ath: number
            price: number
            volume_24h: number
            volume_24h_change_24h: number
        };
    };
}

interface ICoinProps {
}

function Coin({}: ICoinProps) {
    const {coinId} = useParams() as RouteParams;
    const {state} = useLocation() as RouteState;
    const priceMatch = useMatch("/:coinId/price")
    const chartMatch = useMatch("/:coinId/chart")
    const {
        isLoading: infoLoading,
        data: infoData
    } = useQuery<IInfo>(["info", coinId], () => fetchCoinInfo(coinId!))
    const {
        isLoading: tickersLoading,
        data: tickersData
    } = useQuery<IPrice>(["tickers", coinId], () => fetchCoinPrice(coinId!),
        // {refetchInterval: 1000,}
    )
    const loading = infoLoading || tickersLoading
    const navigate = useNavigate()
    console.log(infoData, tickersData)
    return (
        <Container>
            <Helmet>
                <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
            </Helmet>
            <Header>
                <BackButton onClick={() => navigate('/')}>&larr;</BackButton>
                <Title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>Rank:</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol:</span>
                            <span>${infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price:</span>
                            <span>{tickersData?.quotes.USD.price}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Supply:</span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Supply:</span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    <Chart coinId={coinId}/>
                </>
            )}
        </Container>
    );
}

export default Coin;
