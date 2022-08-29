import React, { useContext } from 'react';
import { Title, Text, SimpleGrid } from '@mantine/core';
import EtherContext from '../../context/EtherContext';
import Card from '../../components/Card/Card';
import { ReactComponent as Price } from '../../assets/dashboard-price.svg';
import useStyles from './Dashboard.styles';


const Dashboard = () => {
  const { walletData, dashboardData } = useContext(EtherContext);
  const { classes } = useStyles();


  const row1 = [
    { icon: Price, title: 'Token Price', value: "$" + dashboardData.price },
    { icon: Price, title: 'Market Cap', value: "$" + dashboardData.marketCap },
    // { icon: Holders, title: 'Holders', value: 0.0 },
    { icon: Price, title: 'Circulating Supply', value: dashboardData.circulatingSupply + " TOKEN"},
  ];

  const row12 = [
    { icon: Price, title: 'ETH PRICE', value: "$" + dashboardData.avaxPrice },
  ];
  const row11 = [
    { icon: Price, title: 'TOTAL DIVIDENDS DISTRIBUTED', label: dashboardData.distributed + " ETH" ,value: "$" + dashboardData.distributedUSD },
  ];

  const row2 = [
    { icon: Price, title: 'TOKEN HOLDINGS', label: walletData.balance + " TOKEN" , value: "$" + walletData.balanceInUSD},
    { icon: Price, title: 'ACCOUNT DIVIDEND', label: walletData.dividend + " ETH" , value: walletData.dividendInUSD},
    // { icon: Holders, title: 'Holders', value: 0.0 },
    { icon: Price, title: 'TOKEN DIVIDEND CLAIMED', label: walletData.claimed + " TOKEN" , value: walletData.claimedInUSD},
  ];


  const row1List = row1.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));

  const row12List = row12.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));

  const row11List = row11.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text className={classes.cardStatLabel} size="md">
          {item.label}
        </Text>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));

  const row2List = row2.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text className={classes.cardStatLabel} size="md">
          {item.label}
        </Text>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));



  return (
    <div>
       <Text size="lg">TOKEN</Text>
      <SimpleGrid className={classes.row} cols={3} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row1List}
      </SimpleGrid>
      <SimpleGrid className={classes.row} cols={1} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row12List}
      </SimpleGrid>
      <SimpleGrid className={classes.row} cols={1} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row11List}
      </SimpleGrid>
      <Text size="lg">ACCOUNT</Text>
      <SimpleGrid className={classes.row} cols={3} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row2List}
      </SimpleGrid>
    </div>
  );
};

export default Dashboard;
