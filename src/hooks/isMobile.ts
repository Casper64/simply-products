import { useEffect, useState } from "react"

// You can use this hook to check whether the user is on a mobile device.
export const useMobile = () => {
    const [mobile, setMobile] = useState(false);

    const checkMobile = () => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
            (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
            setMobile(true);
        }
        else if (window.matchMedia("only screen and (max-width: 760px)").matches){
            setMobile(true);
        }
        else {
            setMobile(false);
        }
    }

    useEffect(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    })
    return { mobile }
}