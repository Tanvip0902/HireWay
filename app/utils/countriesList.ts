import { projectGetSourceMapSync } from "next/dist/build/swc/generated-native";

export function getFlagEmoji(location: string) {
    const cleanLocation = location.trim().toLocaleLowerCase();

    const country = countryList.find((country)=>
    cleanLocation.includes(country.name.toLocaleLowerCase())
);
return country?.flagEmoji || " ";
}


export const countryList=[
    {
        "name": "Afghanistan",
        "code": "AF",
        "phoneCode": "+93",
        "flagEmoji": "🇦🇫"
    },
    {
        "name": "Albania",
        "code": "AL",
        "phoneCode": "+355",
        "flagEmoji": "🇦🇱"
    },
    {
        "name": "Algeria",
        "code": "DZ",
        "phoneCode": "+213",
        "flagEmoji": "🇩🇿"
    },
    {
        "name": "Andorra",
        "code": "AD",
        "phoneCode": "+376",
        "flagEmoji": "🇦🇩"
    },
    {
        "name": "Angola",
        "code": "AO",
        "phoneCode": "+244",
        "flagEmoji": "🇦🇴"
    },
    {
        "name": "Antigua and Barbuda",
        "code": "AG",
        "phoneCode": "+1-268",
        "flagEmoji": "🇦🇬"
    },
    {
        "name": "Argentina",
        "code": "AR",
        "phoneCode": "+54",
        "flagEmoji": "🇦🇷"
    },
    {
        "name": "Armenia",
        "code": "AM",
        "phoneCode": "+374",
        "flagEmoji": "🇦🇲"
    },
    {
        "name": "Australia",
        "code": "AU",
        "phoneCode": "+61",
        "flagEmoji": "🇦🇺"
    },
    {
        "name": "Austria",
        "code": "AT",
        "phoneCode": "+43",
        "flagEmoji": "🇦🇹"
    },
    {
        "name": "Azerbaijan",
        "code": "AZ",
        "phoneCode": "+994",
        "flagEmoji": "🇦🇿"
    },
    {
        "name": "Bahamas",
        "code": "BS",
        "phoneCode": "+1-242",
        "flagEmoji": "🇧🇸"
    },
    {
        "name": "Bahrain",
        "code": "BH",
        "phoneCode": "+973",
        "flagEmoji": "🇧🇭"
    },
    {
        "name": "Bangladesh",
        "code": "BD",
        "phoneCode": "+880",
        "flagEmoji": "🇧🇩"
    },
    {
        "name": "Barbados",
        "code": "BB",
        "phoneCode": "+1-246",
        "flagEmoji": "🇧🇧"
    },
    {
        "name": "Belarus",
        "code": "BY",
        "phoneCode": "+375",
        "flagEmoji": "🇧🇾"
    },
    {
        "name": "Belgium",
        "code": "BE",
        "phoneCode": "+32",
        "flagEmoji": "🇧🇪"
    },
    {
        "name": "Belize",
        "code": "BZ",
        "phoneCode": "+501",
        "flagEmoji": "🇧🇿"
    },
    {
        "name": "Benin",
        "code": "BJ",
        "phoneCode": "+229",
        "flagEmoji": "🇧🇯"
    },
    {
        "name": "Bhutan",
        "code": "BT",
        "phoneCode": "+975",
        "flagEmoji": "🇧🇹"
    },
    {
        "name": "Bolivia",
        "code": "BO",
        "phoneCode": "+591",
        "flagEmoji": "🇧🇴"
    },
    {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "phoneCode": "+387",
        "flagEmoji": "🇧🇦"
    },
    {
        "name": "Botswana",
        "code": "BW",
        "phoneCode": "+267",
        "flagEmoji": "🇧🇼"
    },
    {
        "name": "Brazil",
        "code": "BR",
        "phoneCode": "+55",
        "flagEmoji": "🇧🇷"
    },
    {
        "name": "Brunei",
        "code": "BN",
        "phoneCode": "+673",
        "flagEmoji": "🇧🇳"
    },
    {
        "name": "Bulgaria",
        "code": "BG",
        "phoneCode": "+359",
        "flagEmoji": "🇧🇬"
    },
    {
        "name": "Burkina Faso",
        "code": "BF",
        "phoneCode": "+226",
        "flagEmoji": "🇧🇫"
    },
    {
        "name": "Burundi",
        "code": "BI",
        "phoneCode": "+257",
        "flagEmoji": "🇧🇮"
    },
    {
        "name": "Canada",
        "code": "CA",
        "phoneCode": "+1",
        "flagEmoji": "🇨🇦"
    },
    {
        "name": "China",
        "code": "CN",
        "phoneCode": "+86",
        "flagEmoji": "🇨🇳"
    },
    {
        "name": "France",
        "code": "FR",
        "phoneCode": "+33",
        "flagEmoji": "🇫🇷"
    },
    {
        "name": "Germany",
        "code": "DE",
        "phoneCode": "+49",
          "flagEmoji": "🇩🇪"
    },
    {
        "name": "India",
        "code": "IN",
        "phoneCode": "+91",
         "flagEmoji": "🇮🇳" 
    },
    {
        "name": "Indonesia",
        "code": "ID",
        "phoneCode": "+62",
        "flagEmoji": "🇮🇩"
    },
    {
        "name": "Italy",
        "code": "IT",
        "phoneCode": "+39",
        "flagEmoji": "🇮🇹"
    },
    {
        "name": "Japan",
        "code": "JP",
        "phoneCode": "+81",
        "flagEmoji": "🇯🇵"
    },
    {
        "name": "Mexico",
        "code": "MX",
        "phoneCode": "+52",
        "flagEmoji": "🇲🇽"
    },
    {
        "name": "Netherlands",
        "code": "NL",
        "phoneCode": "+31",
        "flagEmoji": "🇳🇱"
    },
    {
        "name": "Pakistan",
        "code": "PK",
        "phoneCode": "+92",
        "flagEmoji": "🇵🇰"
    },
    {
        "name": "Russia",
        "code": "RU",
        "phoneCode": "+7",
        "flagEmoji": "🇷🇺"
    },
    {
        "name": "South Africa",
        "code": "ZA",
        "phoneCode": "+27",
        "flagEmoji": "🇿🇦"
    },
    {
        "name": "United Kingdom",
        "code": "GB",
        "phoneCode": "+44",
        "flagEmoji": "🇬🇧"
    },
    {
        "name": "United States",
        "code": "US",
        "phoneCode": "+1",
        "flagEmoji": "🇺🇸"
    }
]