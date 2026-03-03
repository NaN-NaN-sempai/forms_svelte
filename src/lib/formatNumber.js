export default function (number, disable = false) {
    if(!number) return '';
    const onylNumber = number.replace(/[^0-9]/g, ''); 


    if(disable) return onylNumber;

     
    if(onylNumber.length == 0) return '';
    
    if(onylNumber.length < 8) return number;
  

    if(onylNumber.length == 8)
        return `${onylNumber.slice(0, 4)}-${onylNumber.slice(4)}`;

    if(onylNumber.length == 9)
        return `${onylNumber.slice(0, 1)} ${onylNumber.slice(1, 5)}-${onylNumber.slice(5)}`;

    if(onylNumber.length == 11)
        return `(${onylNumber.slice(0, 2)}) ${onylNumber.slice(2, 3)} ${onylNumber.slice(3, 7)}-${onylNumber.slice(7)}`;

    return number;
}