# Facebook Marketplace, Kijiji, Propertyguys and MLS scraper #
### This tool is to analyze house prices during the upcoming recession ###
```
Coords for each province:
            name            |  xmin   | ymin  |  xmax   | ymax

 ---------------------------+---------+-------+---------+------
  Saskatchewan              | -109.99 | 48.99 | -101.36 | 60.00
  Alberta                   | -120.00 | 48.99 | -109.99 | 60.00
  British Columbia          | -139.06 | 48.30 | -114.03 | 60.00
  Nunavut                   | -120.68 | 51.64 |  -61.08 | 83.11
  Northwest Territories     | -136.44 | 60.00 | -101.98 | 78.76
  Yukon                     | -141.00 | 60.00 | -123.81 | 69.65
  Ontario                   |  -95.16 | 41.66 |  -74.34 | 56.86
  Québec                    |  -79.76 | 44.99 |  -57.10 | 62.59
  New Brunswick             |  -69.06 | 44.60 |  -63.77 | 48.07
  Nova Scotia               |  -66.32 | 43.42 |  -59.68 | 47.03
  Newfoundland and Labrador |  -67.80 | 46.61 |  -52.61 | 60.37
                            |  -61.50 | 47.18 |  -60.13 | 47.80
  Manitoba                  | -102.03 | 48.99 |  -88.94 | 60.00
  Prince Edward Island      |  -64.41 | 45.95 |  -61.97 | 47.06
```
Todo:
1. Send Data from each source to my ELK Stack
2. Normalize adresses with LogStash
3. Create Kibana Charts

```
#.env file sample:
ELASTICSEARCH_USERNAME=username
ELASTICSEARCH_PASSWORD=password
ELASTICSEARCH_HOST=host
ELASTICSEARCH_PORT=port

````
