import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { InputAdornment } from '@mui/material';
import NhaLogo from 'shared/assests/nhaLogo.png';
import BajajLogo from 'shared/assests/bajajLogo.png';
import { LoginPayload } from './types';
import useLoginUser from './services/useLoginUser';

function Login() {
  const navigate = useNavigate();
  const { mutation: { mutate: loginApi }} = useLoginUser();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      hpAddress: '',
      password: '',
    },
  });

  const handleLogin = (values: LoginPayload) => {
    loginApi({ hpAddress: `${values.hpAddress}@hpr.abdm`, password: values.password}, {
      onSuccess: (response) => {
        // success response
        const accessToken = response.data.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('hpAddress', `${values.hpAddress}@hpr.abdm`);
          localStorage.setItem('name', `${response.data.name}`)
          navigate('../dashboard');
        }
      },
      onError: () => {
        // error response
        // remove this navigate
        // navigate('../dashboard');
      }
    })
  };

  return (
    <div className="p-4 h-screen flex flex-col items-center justify-between">
      <div className="flex items-center flex-col grow-[1]">
        <img src={NhaLogo} alt="NHA Logo" className="h-24 mt-4" />
        <img src={BajajLogo} alt="Bajaj Health Logo" className="h-10 mt-4" />
      </div>
      <form className="grow-[3]" onSubmit={handleSubmit(handleLogin)}>
        <div className="w-full max-w-xs mt-12">
          <div className="flex flex-col">
            <span className="text-base font-sans mb-1">HP Address</span>
            <Controller control={control} name="hpAddress" render={({ field }) => <OutlinedInput {...field} autoComplete="off" placeholder="HP Address" endAdornment={
                <InputAdornment position="end">
                  @hpr.abdm
                </InputAdornment>
              }/>} />
          </div>
          <div className='flex flex-col mt-5'>
            <span className='text-base font-sans mb-1'>Password</span>
            <Controller control={control} name="password" render={({ field }) => <OutlinedInput {...field} autoComplete="off" placeholder="Password" type="password" />} />
          </div>
          </div>
            <Button fullWidth className='!mt-20 !mr-2 !ml-2 !max-w-xs !text-base !bg-[#52b6c3] !h-12' variant='contained' type="submit">LOGIN</Button>
          <div>
        </div>
      </form>
    </div>
  );
}

export default Login;
