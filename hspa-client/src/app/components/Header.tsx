import LeftArrow from 'shared/assests/leftArrow.svg';
import { HeaderProps } from '../../modules/dashboard/types';

const Header: React.FC<HeaderProps> = ({ heading, onBack }) => {
  return (
    <div className="h-16 bg-white fixed w-full top-0 flex items-center max-w-md z-[1]">
      <img src={LeftArrow} alt="Left Arrow" className='ml-2' onClick={onBack}/>
      <p className='text-base text-black font-semibold w-full text-center'>{heading}</p>
    </div>
  )
}

export default Header;