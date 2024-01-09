import Heavyrain from '../assets/images/heavyrain.png';
import Moderaterain from '../assets/images/moderaterain.png';
import Snow from '../assets/images/snow.svg';
import Mist from '../assets/images/mist.png';
import Sun from '../assets/images/sun.png';
import Partlycloudy from '../assets/images/partlycloudy.png';
import Cloud from '../assets/images/cloud.png';
import { ImageSourcePropType } from 'react-native';

const appid = 'be7e9a9c61fecdb8c9e38ac53feedc27';

const weatherImage: { [key in string]: ImageSourcePropType } = {
   '11d': Heavyrain,
   '09d': Heavyrain,
   '10d': Moderaterain,
   '13d': Snow,
   '50d': Mist,
   '01d': Sun,
   '01n': Sun,
   '02d': Partlycloudy,
   '02n': Partlycloudy,
   '03d': Cloud,
   '03n': Cloud,
   '04d': Cloud,
   '04n': Cloud
}

export {
   appid,
   weatherImage
}