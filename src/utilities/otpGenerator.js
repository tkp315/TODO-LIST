function newOTP(len)
{
     const s = "0123456789";
     const n = s.length;
     let otp="";
    for(let i =0; i<len;i++)
    {
        const idx = Math.floor(Math.random()*n);
        otp+=s[idx];
    }

    return otp;
}
export{newOTP}