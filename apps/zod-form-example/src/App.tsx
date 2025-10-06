import { ChangeEventHandler } from 'react';
import {
  Box, Button,
  Card,
  CardContent,
  CardOverflow,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from '@mui/joy';
import { useFormErrors, useFormValue, ZodForm } from '@childishforces/zod-form/src';
import { z } from 'zod';
import { EditNote, Lock, Mail } from '@mui/icons-material';

declare module '@mui/material' {
  interface SvgIconPropsSizeOverrides {
    'xl': true;
    'xl2': true;
  }
}

const image = 'https://picsum.photos/id/519/1200/900';

const form = new ZodForm({
  schema: z.object({
    email: z.email({ error: 'Email address is invalid' }),
    password: z.string().min(5)
      .regex(/[a-z]/g, { error: 'Must include a lowercase character' })
      .regex(/[A-Z]/g, { error: 'Must include an uppercase character' })
      .regex(/\d/g, { error: 'Must include a number' })
      // eslint-disable-next-line no-useless-escape
      .regex(/[$£€#!\-_\\\[\]{}+=^%@]/g, { error: 'Must include a special character' }),
  }),
  initialState: {
    email: '',
    password: '',
  }
})

function App() {
  const { state, valid } = useFormValue(form);
  const { errors, showForKey } = useFormErrors(form);

  const handleChange = (key: keyof z.infer<typeof form.schema>): ChangeEventHandler<HTMLInputElement> => {
    const setter = form.createBasicSetter(key);
    return (event) => setter(event.target.value);
  }

  return (
    <Box component="div" sx={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}>
      <Box
        component="main"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        padding={2}
        sx={{
          backgroundColor: ({ vars }) => `rgba(${vars.palette.neutral.darkChannel} / 0.9)`,
          backdropFilter: 'blur(8px)'
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: ({spacing}) => spacing(50)
          }}
        >
          <CardOverflow variant="plain">
            <CardContent>
              <Box display="flex" alignItems="center" gap={0.5}>
                <EditNote fontSize="xl2" />
                <Typography level="title-lg" color="neutral">
                  Test Zod Form
                </Typography>
              </Box>
            </CardContent>
            <Divider inset="context" />
          </CardOverflow>
          <CardContent>
            <Box gap={2} display="flex" flexDirection="column" pt={1} pb={2}>
              <FormControl error={Boolean(errors.email)}>
                <FormLabel>Email</FormLabel>
                <Input
                  size="lg"
                  sx={{ fontSize: 16 }}
                  startDecorator={<Mail fontSize="xl" />}
                  placeholder="john@example.com"
                  value={state.email}
                  onBlur={showForKey('email')}
                  onChange={handleChange('email')}
                />
                {errors.email?.map((error) => (
                  <FormHelperText key={error}>
                    {error}
                  </FormHelperText>
                ))}
              </FormControl>
              <FormControl error={Boolean(errors.password)}>
                <FormLabel>Password</FormLabel>
                <Input
                  size="lg"
                  sx={{ fontSize: 16 }}
                  startDecorator={<Lock fontSize="xl" />}
                  placeholder="5oM3p4s5w0rd!"
                  value={state.password}
                  onBlur={showForKey('password')}
                  onChange={handleChange('password')}
                  type="password"
                />
                {errors.password?.map((error) => (
                  <FormHelperText key={error}>
                    {error}
                  </FormHelperText>
                ))}
              </FormControl>
            </Box>
          </CardContent>
          <CardOverflow variant="soft">
            <Divider inset="context" />
            <CardContent>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box display="flex" flexDirection="row" gap={2}>
                  <Typography level="body-xs">Forgot password</Typography>
                  <Divider orientation="vertical" />
                  <Typography level="body-xs">Sign up</Typography>
                </Box>
                <Box flexGrow={1} />
                <Button
                  onClick={function(){}}
                  size="sm"
                  variant="solid"
                  disabled={!valid}
                >
                  Sign In
                </Button>
              </Box>
            </CardContent>
          </CardOverflow>
        </Card>
      </Box>
    </Box>
  )
}

export default App
