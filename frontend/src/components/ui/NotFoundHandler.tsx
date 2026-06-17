import { Link as RouterLink } from 'react-router-dom';
import { Alert, AlertTitle, Box, Button, Container, Paper, Typography } from '@mui/material';

export function NotFoundHandler() {
  return (
    <Container
      maxWidth={false}
      sx={{ py: { xs: 0.5, sm: 2 }, minHeight: '100vh', pb: 10, px: { xs: 0.5, sm: 2 } }}
    >
      <Alert severity='warning'>
        <strong>Няма такава страница.</strong> Page not found.
      </Alert>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Paper elevation={6} sx={{ maxWidth: 600, width: '100%', borderRadius: 2 }}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Alert severity='error'>
              <AlertTitle>Няма такава страница</AlertTitle>
              Page not found
            </Alert>
            <Typography sx={{ pt: 2 }}>
              Този website съдържа информация за места за летене с парапланер в България.
            </Typography>
            <Typography sx={{ pt: 2 }}>
              {' '}
              Може да използвате бутоните по-долу за навигация към началната страница или към
              сайта на SkySpirit за тандемни полети с парапланер.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              flexWrap: 'wrap',
              px: { xs: 2, sm: 3 },
              pb: { xs: 2, sm: 3 },
            }}
          >
            <Button component={RouterLink} to='/' variant='contained' color='primary'>
              Места за летене с парапланер
            </Button>
            <Button
              component='a'
              href='https://skyspirit.bg/'
              target='_blank'
              rel='noopener noreferrer'
              variant='outlined'
              color='primary'
            >
              Тандемни полети с парапланер
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
