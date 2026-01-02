import { changeSpecialToGeneral } from "../services/giftApi";

interface changeSpeToGen {
    unboxingTime: string;
    giftId: string;
}

export const changeSpeToGen = ({unboxingTime, giftId}: changeSpeToGen) => {
    const changeDate = async () => {
        const checkDate = new Date(unboxingTime);
        const currentDate = new Date()

        if (checkDate >= currentDate) {
            try {
                const res = changeSpecialToGeneral(giftId)
                return res;
            } catch (err) {
                console.log("", err)
                return null;
            }
            
        }
    };

    const result = changeDate();
    return result;
}