import React from 'react'
import styled from "styled-components"
import {Link} from "react-router-dom"
import {useQuery} from "react-query"
import {fetchCoins} from "../api"
import {Helmet} from "react-helmet-async"

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CoinList = styled.ul``

const Coin = styled.li`
  background-color: ${props => props.theme.cardBgColor};
  color: ${props => props.theme.textColor};
  border: 1px solid;
  border-radius: 15px;
  margin-bottom: 10px;
  font-size: 24px;

  a {
    transition: color 150ms ease-in;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
      color: ${props => props.theme.accentColor}
    }
  }
`

const Title = styled.div`
  font-size: 48px;
  color: ${props => props.theme.accentColor};
`

const Loader = styled.span`
  font-size: 32px;
  color: ${props => props.theme.accentColor};
`

const Img = styled.img`
  width: 32px;
  height: 32px;
`

interface ICoin {
    "id": string
    "name": string
    "symbol": string
    "rank": number
    "is_new": boolean
    "is_active": boolean
    "type": string
}

const Coins = () => {
    const {isLoading, data} = useQuery<ICoin[]>("allCoins", fetchCoins)
    return (
        <Container>
            <Helmet>
                <title>Coin Tracker</title>
            </Helmet>
            <Header>
                <Title>Coin Tracker</Title>
            </Header>
            {isLoading ?
                <Loader>Loading...</Loader> :
                (<CoinList>
                    {data?.slice(0, 29).map(coin =>
                        <Coin key={coin.id}>
                            <Link to={{
                                pathname: `/${coin.id}`
                            }} state={{
                                name: coin.name, rank: coin.rank
                            }}>{
                                <Img
                                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLocaleLowerCase()}`}
                                    alt="Coin's icon"/>
                            } {coin.name} &rarr;</Link>
                        </Coin>)
                    }
                </CoinList>)}
        </Container>
    );
}

export default Coins;
