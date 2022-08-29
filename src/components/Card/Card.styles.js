import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    padding: 20,
    background: 'transparent linear-gradient(117deg, #c62abc 0%, #c62abc 50%, #9415ff 100%) 0% 0% no-repeat padding-box',
    backdropFilter: 'blur(1000px)',
    border: '2px solid #c426c2',
    borderRadius: 14,
  },
}));

export default useStyles;
