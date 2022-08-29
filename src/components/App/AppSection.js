import React, { useContext } from 'react';
import { Anchor } from '@mantine/core';
import EtherContext from '../../context/EtherContext';
import WalletButton from '../Wallet/WalletButton';
import WalletMessage from '../Wallet/WalletMessage';
import useStyles from './AppSection.styles';

const NavbarSection = ({ children }) => {
  const { user } = useContext(EtherContext);
  const { classes } = useStyles();

  return (
    <div className={classes.section}>

      <div className={classes.content}>
        <div className={classes.wallet}>{user ? <WalletMessage /> : <WalletButton />}</div>
        {children}
        <div className={classes.social}>
          <Anchor className={classes.icon} href="/" target="_blank" rel="noreferrer">
           
          </Anchor>
          <Anchor className={classes.icon} href="/" target="_blank" rel="noreferrer">
        
          </Anchor>
          <Anchor className={classes.icon} href="/" target="_blank" rel="noreferrer">
         
          </Anchor>
        </div>
      </div>
    </div>
  );
};

export default NavbarSection;
