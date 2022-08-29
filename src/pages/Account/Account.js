import React, { useContext } from 'react';
import { Title, Text, SimpleGrid } from '@mantine/core';
import EtherContext from '../../context/EtherContext';
import Card from '../../components/Card/Card';
import { ReactComponent as Wallet } from '../../assets/account-balance.svg';
import { ReactComponent as Avax } from '../../assets/account-avax.svg';
import { ReactComponent as AvaxPrice } from '../../assets/account-avaxprice.svg';

import useStyles from './Account.styles';

const Account = () => {
  const {walletData, dashboardData} = useContext(EtherContext);
  const { classes } = useStyles();

  const row2 = [
    { icon: Avax, title: 'ETH BALANCE', label: `${walletData.AVAXbalance} ETH`, value: `$${walletData.AVAXbalanceInUSD}` },
    { icon: AvaxPrice, title: 'ETH Price', label: 'ETH', value: `$${dashboardData.avaxPrice}` },
  ];

  const row2List = row2.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={5}>
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



      <div className={classes.row}>
        <SimpleGrid className={classes.row} cols={2} spacing={40} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
          {row2List}
        </SimpleGrid>
      </div>
      <div className={classes.row}>
        <Card className={classes.cardStat}>
          <Wallet className={classes.cardStatIcon} />
          <div>
            <Title className={classes.cardStatTitle} order={5}>
              Token Balance  
            </Title>
            <Text className={classes.cardStatLabel} size="md">
            {walletData.balance}
            </Text>
            <Text size="lg">${walletData.balanceInUSD}</Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Account;
