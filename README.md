# Rental Value Calculator

This is a utility for estimating the rental value of publically listed properties. It works by searching all available public listings for the provided location and radius, extracting the relevant information, pulling in publically listed rental data, and then calculating the revenue profile.

## Technical

This utility is a client only web app built in typescript.

User Input - always required input
- location (use google search API for convenience)
- radius (distance around location to search)
- down payment ()
- loan interest rate (default to queried info)
- 

Data Queries
- mls sale listings (multifamily buy) (MLSGrid, Paragon, FlexMLS, CoreLogic, Bridge)
 - homes.com (multifamily buy)
 - realtor.com (multifamily buy)
 - loopnet.com (multifamily buy)
 - zillow.com (multifamily buy)
- sba loan interest rates and/or wall street prime rate
- property tax rates for locale
- mortgage insurance rates
- home insurance rates
- mls rental listings (rent)
 - apartments.com (rent)
 - homes.com (rent)
 - realtor.com (rent)
 - loopnet.com (rent)
 - zillow.com (rent)

 Core Model
 - 

 Core Utilities
 - loan calculator

## MVP

nothing is pulled from other internet sources - meaning everything is entered manually
