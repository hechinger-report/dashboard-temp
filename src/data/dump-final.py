import csv
from collections import OrderedDict
import json

# Print a test to make sure it's working
print("hello")

# Run 'cat dump.py' to debug/see if anything in dump.py loads in terminal

# Read the .csv file
data = csv.DictReader(open("merged-final-data.csv","r"))

# Function to print "null" for no info
def convertInt(value):
    if value is 'null':
        return 1
    else:
        try:
            return int(value)
        except ValueError:
            return 1

def parseFloat(num):
    if num is 'null':
        return None
    else:
        try:
            return float(num)
        except ValueError:
            return None

# Loop through each record and output a file by unitid
for row in data:
    institution = OrderedDict()
    if row['UnitID'] == '138682':
        print row["Total price for in-state students living off campus (not with family)  2020-21 (DRVIC2020)"]

    institution['unitid'] = row['UnitID']
    institution['institution'] = row['Institution Name']
    institution['alias'] = row['Institution name alias (HD2017)']
    institution['city'] = row['City location of institution (HD2017)']
    institution['state'] = row['State abbreviation (HD2017)']
    institution['website'] = row["Institution's internet website address (HD2017)"]
    institution['lat'] = parseFloat(row['Latitude location of institution (HD2017)'])
    institution['lon'] = parseFloat(row['Longitude location of institution (HD2017)'])
    institution['hbcu'] = convertInt(row['Historically Black College or University (HD2017)'])
    institution['tribal_college'] = convertInt(row['Tribal college (HD2017)'])
    institution['level'] = convertInt(row['Sector of institution (HD2017)'])
    institution['control'] = convertInt(row['Control of institution (HD2017)'])
    institution['calculator'] = row["Net price calculator web address (HD2017)"]

    enrollment = [
        ('perc_admitted',convertInt(row['Percent admitted - total (DRVADM2017)'])),
        ('perc_sticker',convertInt(row['Sticker'])),
        ("enrollment_unknown",convertInt(row["Race/ethnicity unknown total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_twomore",convertInt(row["Two or more races total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_white",convertInt(row["White total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_hisp",convertInt(row["Hispanic total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_nathawpacisl",convertInt(row["Native Hawaiian or Other Pacific Islander total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_black",convertInt(row["Black or African American total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_asian",convertInt(row["Asian total (EF2017A  All students  Undergraduate total)"])),
        ("enrollment_amerindalasknat",convertInt(row["American Indian or Alaska Native total (EF2017A  All students  Undergraduate total)"])),
        ("total_men",convertInt(row["Total men (EF2017  All students  Undergraduate total)"])),
        ("total_women",convertInt(row["Total women (EF2017  All students  Undergraduate total)"])),
        ("total_enrollment",convertInt(row["Grand total (EF2017  All students  Undergraduate total)"]))

    ]

    institution["enrollment"] = OrderedDict(enrollment)

    # Find the year in row headers
    # Build a JSON array based on the the yearly data for each school
    years_list_20_21 = [
        ("year","20-21"),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2020-21 (DRVIC2020)"])),
        # ("price_outofstate_oncampus",convertInt(row["Total price for out-of-state students living on campus 2020-21 (DRVIC2020)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2020-21 (DRVIC2020)"])),
        # ("price_outstate_offcampus_nofamily",convertInt(row["Total price for out-of-state students living off campus (not with family)  2020-21 (DRVIC2020)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2020-21 (DRVIC2020)"])),
        # ("price_outstate_offcampus_family",convertInt(row["Total price for out-of-state students living off campus (with family)  2020-21 (DRVIC2020)"])),

        # ("avg_net_price_0_30000_titleiv_public",(convertInt(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - public"]))),
        # ("avg_net_price_30001_48000_titleiv_public",(convertInt(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - public"]))),
        # ("avg_net_price_48001_75000_titleiv_public",(convertInt(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - public"]))),
        # ("avg_net_price_75001_110000_titleiv_public",(convertInt(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - public"]))),
        # ("avg_net_price_110001_titleiv_public",(convertInt(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - public"]))),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - privateforprofit"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - privateforprofit"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - privateforprofit"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - privateforprofit"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2020-21 (SFA2021) - privateforprofit"])),
    ]
    years_list_19_20 = [
        ("year","19-20"),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2019-20 (DRVIC2019)"])),
        # ("price_outofstate_oncampus",convertInt(row["Total price for out-of-state students living on campus 2019-20 (DRVIC2019)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2019-20 (DRVIC2019)"])),
        # ("price_outstate_offcampus_nofamily",convertInt(row["Total price for out-of-state students living off campus (not with family)  2019-20 (DRVIC2019)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2019-20 (DRVIC2019)"])),
        # ("price_outstate_offcampus_family",convertInt(row["Total price for out-of-state students living off campus (with family)  2019-20 (DRVIC2019)"])),

        # ("avg_net_price_0_30000_titleiv_public",(convertInt(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - public"]))),
        # ("avg_net_price_30001_48000_titleiv_public",(convertInt(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - public"]))),
        # ("avg_net_price_48001_75000_titleiv_public",(convertInt(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - public"]))),
        # ("avg_net_price_75001_110000_titleiv_public",(convertInt(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - public"]))),
        # ("avg_net_price_110001_titleiv_public",(convertInt(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - public"]))),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - privateforprofit"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - privateforprofit"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - privateforprofit"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - privateforprofit"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2019-20 (SFA1920) - privateforprofit"])),
    ]
    
    years_list_18_19 = [
            ("year","18-19"),
            # ("instate_tuition_fees",convertInt(row["Published in-state tuition and fees 2018-19 (IC2018_AY)"])),

            # ("full_time_retention_rate",convertInt(row["Full-time retention rate  2018 (EF2018D)"])),
            # ("part_time_retention_rate",convertInt(row["Part-time retention rate  2018 (EF2018D)"])),

            ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2018-19 (DRVIC2018)"])),
            # ("price_outofstate_oncampus",convertInt(row["Total price for out-of-state students living on campus 2018-19 (DRVIC2018)"])),
            ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2018-19 (DRVIC2018)"])),
            # ("price_outstate_offcampus_nofamily",convertInt(row["Total price for out-of-state students living off campus (not with family)  2018-19 (DRVIC2018)"])),
            # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2018-19 (DRVIC2018)"])),
            # ("price_outstate_offcampus_family",convertInt(row["Total price for out-of-state students living off campus (with family)  2018-19 (DRVIC2018)"])),

            # ("avg_net_price_0_30000_titleiv_public",(convertInt(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - public"]))),
            # ("avg_net_price_30001_48000_titleiv_public",(convertInt(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - public"]))),
            # ("avg_net_price_48001_75000_titleiv_public",(convertInt(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - public"]))),
            # ("avg_net_price_75001_110000_titleiv_public",(convertInt(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - public"]))),
            # ("avg_net_price_110001_titleiv_public",(convertInt(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - public"]))),

            ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - privateforprofit"])),
            ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - privateforprofit"])),
            ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - privateforprofit"])),
            ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - privateforprofit"])),
            ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2018-19 (SFA1819) - privateforprofit"])),

            # ("number_income_public_0_30000",convertInt(row["Number in income level (0-30 000)  2018-19 (SFA1819) - public"])),
            # ("number_income_public_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2018-19 (SFA1819) - public"])),
            # ("number_income_public_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2018-19 (SFA1819) - public"])),
            # ("number_income_public_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2018-19 (SFA1819) - public"])),
            # ("number_income_public_110001",convertInt(row["Number in income level (110 001 or more)  2018-19 (SFA1819) - public"])),

            # ("number_income_privateforprofit_0_30000",convertInt(row["Number in income level (0-30 000)  2018-19 (SFA1819) - privateforprofit"])),
            # ("number_income_privateforprofit_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2018-19 (SFA1819) - privateforprofit"])),
            # ("number_income_privateforprofit_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2018-19 (SFA1819) - privateforprofit"])),
            # ("number_income_privateforprofit_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2018-19 (SFA1819) - privateforprofit"])),
            # ("number_income_privateforprofit_110001",convertInt(row["Number in income level (110 001 or more)  2018-19 (SFA1819) - privateforprofit"])),

    ]
    years_list_17_18 = [
            ("year","17-18"),
            # ("instate_tuition_fees",convertInt(row["Published in-state tuition and fees 2017-18 (IC2017_AY)"])),

            ("full_time_retention_rate",parseFloat(row["Retention full-time total"])),
            ("part_time_retention_rate",parseFloat(row["Retention part-time total"])),

            ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2017-18 (DRVIC2017)"])),
            # ("price_outofstate_oncampus",convertInt(row["Total price for out-of-state students living on campus 2017-18 (DRVIC2017)"])),
            ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2017-18 (DRVIC2017)"])),
            # ("price_outstate_offcampus_nofamily",convertInt(row["Total price for out-of-state students living off campus (not with family)  2017-18 (DRVIC2017)"])),
            # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2017-18 (DRVIC2017)"])),
            # ("price_outstate_offcampus_family",convertInt(row["Total price for out-of-state students living off campus (with family)  2017-18 (DRVIC2017)"])),

            # ("avg_net_price_0_30000_titleiv_public",(convertInt(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - public"]))),
            # ("avg_net_price_30001_48000_titleiv_public",(convertInt(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - public"]))),
            # ("avg_net_price_48001_75000_titleiv_public",(convertInt(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - public"]))),
            # ("avg_net_price_75001_110000_titleiv_public",(convertInt(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - public"]))),
            # ("avg_net_price_110001_titleiv_public",(convertInt(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - public"]))),

            ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - privateforprofit"])),
            ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - privateforprofit"])),
            ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - privateforprofit"])),
            ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - privateforprofit"])),
            ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2017-18 (SFA1718) - privateforprofit"])),

            # ("number_income_public_0_30000",convertInt(row["Number in income level (0-30 000)  2017-18 (SFA1718) - public"])),
            # ("number_income_public_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2017-18 (SFA1718) - public"])),
            # ("number_income_public_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2017-18 (SFA1718) - public"])),
            # ("number_income_public_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2017-18 (SFA1718) - public"])),
            # ("number_income_public_110001",convertInt(row["Number in income level (110 001 or more)  2017-18 (SFA1718) - public"])),

            # ("number_income_privateforprofit_0_30000",convertInt(row["Number in income level (0-30 000)  2017-18 (SFA1718) - privateforprofit"])),
            # ("number_income_privateforprofit_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2017-18 (SFA1718) - privateforprofit"])),
            # ("number_income_privateforprofit_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2017-18 (SFA1718) - privateforprofit"])),
            # ("number_income_privateforprofit_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2017-18 (SFA1718) - privateforprofit"])),
            # ("number_income_privateforprofit_110001",convertInt(row["Number in income level (110 001 or more)  2017-18 (SFA1718) - privateforprofit"])),

            ("grad_rate_associate_3years_total",parseFloat(row["Grand total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),

            ("grad_rate_associate_3years_white",parseFloat(row["White total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_black",parseFloat(row["Black or African American total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_hisp",parseFloat(row["Hispanic total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_amerindalasknat",parseFloat(row["American Indian or Alaska Native total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_unknown",parseFloat(row["Race/ethnicity unknown total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_asian",parseFloat(row["Asian total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_nathawpacisl",parseFloat(row["Native Hawaiian or Other Pacific Islander total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),
            ("grad_rate_associate_3years_twomore",parseFloat(row["Two or more races total (GR2017 2-year institutions CALCULATED GRADUATION RATE)"])),

            # ("grad_cohort_associate_3years_total",parseFloat(row["Grand total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),

            # ("grad_cohort_associate_3years_white",parseFloat(row["White total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_black",parseFloat(row["Black or African American total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_hisp",parseFloat(row["Hispanic total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_amerindalasknat",parseFloat(row["American Indian or Alaska Native total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_unknown",parseFloat(row["Race/ethnicity unknown total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_asian",parseFloat(row["Asian total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_nathawpacisl",parseFloat(row["Native Hawaiian or Other Pacific Islander total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),
            # ("grad_cohort_associate_3years_twomore",parseFloat(row["Two or more races total (GR2017  Degree/certif-seeking students ( 2-yr institution) Adjusted cohort (revised cohort minus exclusions))"])),

            ("grad_rate_bachelors_6years_total",parseFloat(row["Grand total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),

            ("grad_rate_bachelors_6years_white",parseFloat(row["White total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_black",parseFloat(row["Black or African American total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_hisp",parseFloat(row["Hispanic total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_amerindalasknat",parseFloat(row["American Indian or Alaska Native total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_unknown",parseFloat(row["Race/ethnicity unknown total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_twomore",parseFloat(row["Two or more races total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_asian",parseFloat(row["Asian total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
            ("grad_rate_bachelors_6years_nathawpacisl",parseFloat(row["Native Hawaiian or Other Pacific Islander total (GR2017  4-year institutions  CALCULATED GRADUATION RATE)"])),
        ]
   
    years_list_16_17 = [
        ("year","16-17"),
        # ("instate_tuition_fees",convertInt(row["Published in-state tuition and fees 2016-17 (IC2016_AY)"])),

        # ("full_time_retention_rate",convertInt(row["Full-time retention rate  2016 (EF2016D)"])),
        # ("part_time_retention_rate",convertInt(row["Part-time retention rate  2016 (EF2016D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2016-17 (DRVIC2016)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2016-17 (DRVIC2016)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2016-17 (DRVIC2016)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2016-17 (DRVIC2016)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2016-17 (DRVIC2016)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2016-17 (DRVIC2016)"])),

        # ("avg_net_price_0_30000_titleiv_public",(convertInt(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617) - public"]))),
        # ("avg_net_price_30001_48000_titleiv_public",(convertInt(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617) - public"]))),
        # ("avg_net_price_48001_75000_titleiv_public",(convertInt(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617) - public"]))),
        # ("avg_net_price_75001_110000_titleiv_public",(convertInt(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617) - public"]))),
        # ("avg_net_price_110001_titleiv_public",(convertInt(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617) - public"]))),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2016-17 (SFA1617)"])),

        # ("number_income_public_0_30000",convertInt(row["Number in income level (0-30 000)  2016-17 (SFA1617) - public"])),
        # ("number_income_public_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2016-17 (SFA1617) - public"])),
        # ("number_income_public_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2016-17 (SFA1617) - public"])),
        # ("number_income_public_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2016-17 (SFA1617) - public"])),
        # ("number_income_public_110001",convertInt(row["Number in income level (110 001 or more)  2016-17 (SFA1617) - public"])),

        # ("number_income_privateforprofit_0_30000",convertInt(row["Number in income level (0-30 000)  2016-17 (SFA1617)"])),
        # ("number_income_privateforprofit_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2016-17 (SFA1617)"])),
        # ("number_income_privateforprofit_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2016-17 (SFA1617)"])),
        # ("number_income_privateforprofit_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2016-17 (SFA1617)"])),
        # ("number_income_privateforprofit_110001",convertInt(row["Number in income level (110 001 or more)  2016-17 (SFA1617)"])),
  ]

    years_list_15_16 = [
        ("year","15-16"),
        # ("instate_tuition_fees",convertInt(row["Published in-state tuition and fees 2015-16 (IC2015_AY)"])),

        # ("full_time_retention_rate",convertInt(row["Full-time retention rate  2015 (EF2015D)"])),
        # ("part_time_retention_rate",convertInt(row["Part-time retention rate  2015 (EF2015D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2015-16 (DRVIC2015)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2015-16 (DRVIC2015)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2015-16 (DRVIC2015)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2015-16 (DRVIC2015)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2015-16 (DRVIC2015)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2015-16 (DRVIC2015)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",convertInt(row["Percent of full-time first-time undergraduates awarded Pell grants (SFA1516)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",convertInt(row["Average amount of Pell grant aid awarded to full-time first-time undergraduates (SFA1516)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",convertInt(row["Number of full-time first-time undergraduates awarded Pell grants (SFA1516)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",convertInt(row["Percent of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1516)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",convertInt(row["Average amount of federal  state  local or institutional grant aid awarded (SFA1516)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",convertInt(row["Number of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1516)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",convertInt(row["Percent of full-time first-time undergraduates awarded federal student loans (SFA1516)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",convertInt(row["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1516)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",convertInt(row["Number of full-time first-time undergraduates awarded federal student loans (SFA1516)"])),

        # ("avg_net_price_0_30000_titleiv_public",convertInt(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",convertInt(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",convertInt(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",convertInt(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516) - public"])),
        # ("avg_net_price_110001_titleiv_public",convertInt(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2015-16 (SFA1516)"])),

        # ("number_income_public_0_30000",convertInt(row["Number in income level (0-30 000)  2015-16 (SFA1516) - public"])),
        # ("number_income_public_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2015-16 (SFA1516) - public"])),
        # ("number_income_public_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2015-16 (SFA1516) - public"])),
        # ("number_income_public_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2015-16 (SFA1516) - public"])),
        # ("number_income_public_110001",convertInt(row["Number in income level (110 001 or more)  2015-16 (SFA1516) - public"])),

        # ("number_income_privateforprofit_0_30000",convertInt(row["Number in income level (0-30 000)  2015-16 (SFA1516) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",convertInt(row["Number in income level (30 001-48 000)  2015-16 (SFA1516) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",convertInt(row["Number in income level (48 001-75 000)  2015-16 (SFA1516) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",convertInt(row["Number in income level (75 001-110 000)  2015-16 (SFA1516) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",convertInt(row["Number in income level (110 001 or more)  2015-16 (SFA1516) - privateforprofit"])),
   ]

    years_list_14_15 = [
        ("year","14-15"),

        # ("instate_tuition_fees",convertInt(row["Published in-state tuition and fees 2014-15 (IC2014_AY)"])),

        # ("full_time_retention_rate",convertInt(row["Full-time retention rate  2014 (EF2014D)"])),
        # ("part_time_retention_rate",convertInt(row["Part-time retention rate  2014 (EF2014D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2014-15 (DRVIC2014)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2014-15 (DRVIC2014)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2014-15 (DRVIC2014)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2014-15 (DRVIC2014)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2014-15 (DRVIC2014)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2014-15 (DRVIC2014)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded Pell grants (SFA1415)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",parseFloat(row["Average amount of Pell grant aid awarded to full-time first-time undergraduates (SFA1415)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded Pell grants (SFA1415)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Percent of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1415)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",parseFloat(row["Average amount of federal  state  local or institutional grant aid awarded (SFA1415)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Number of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1415)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded federal student loans (SFA1415)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",parseFloat(row["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1415)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded federal student loans (SFA1415)"])),

        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2014-15 (SFA1415)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2014-15 (SFA1415) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2014-15 (SFA1415) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2014-15 (SFA1415) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2014-15 (SFA1415) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2014-15 (SFA1415) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2014-15 (SFA1415) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2014-15 (SFA1415) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2014-15 (SFA1415) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2014-15 (SFA1415) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2014-15 (SFA1415) - privateforprofit"])),
     ]
    years_list_13_14 = [
        ("year","13-14"),

        # ("instate_tuition_fees",parseFloat(row["Published in-state tuition and fees 2013-14 (IC2013_AY)"])),

        # ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2013 (EF2013D)"])),
        # ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2013 (EF2013D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2013-14 (DRVIC2013)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2013-14 (DRVIC2013)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2013-14 (DRVIC2013)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2013-14 (DRVIC2013)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2013-14 (DRVIC2013)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2013-14 (DRVIC2013)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded Pell grants (SFA1314)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",parseFloat(row["Average amount of Pell grant aid awarded to full-time first-time undergraduates (SFA1314)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded Pell grants (SFA1314)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Percent of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1314)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",parseFloat(row["Average amount of federal  state  local or institutional grant aid awarded (SFA1314)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Number of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1314)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded federal student loans (SFA1314)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",parseFloat(row["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1314)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded federal student loans (SFA1314)"])),

        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2013-14 (SFA1314)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2013-14 (SFA1314) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2013-14 (SFA1314) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2013-14 (SFA1314) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2013-14 (SFA1314) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2013-14 (SFA1314) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2013-14 (SFA1314) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2013-14 (SFA1314) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2013-14 (SFA1314) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2013-14 (SFA1314) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2013-14 (SFA1314) - privateforprofit"])),

  ]

    years_list_12_13 = [
        ("year","12-13"),

        # ("instate_tuition_fees",parseFloat(row["Published in-state tuition and fees 2012-13 (IC2012_AY)"])),

        # ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2012 (EF2012D)"])),
        # ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2012 (EF2012D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2012-13 (DRVIC2012)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2012-13 (DRVIC2012)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2012-13 (DRVIC2012)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2012-13 (DRVIC2012)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2012-13 (DRVIC2012)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2012-13 (DRVIC2012)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded Pell grants (SFA1213)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",parseFloat(row["Average amount of Pell grant aid awarded to full-time first-time undergraduates (SFA1213)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded Pell grants (SFA1213)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Percent of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1213)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",parseFloat(row["Average amount of federal  state  local or institutional grant aid awarded (SFA1213)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Number of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1213)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded federal student loans (SFA1213)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",parseFloat(row["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1213)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded federal student loans (SFA1213)"])),

        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2012-13 (SFA1213)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2012-13 (SFA1213) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2012-13 (SFA1213) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2012-13 (SFA1213) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2012-13 (SFA1213) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2012-13 (SFA1213) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2012-13 (SFA1213) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2012-13 (SFA1213) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2012-13 (SFA1213) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2012-13 (SFA1213) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2012-13 (SFA1213) - privateforprofit"])),
    ]

    years_list_11_12 = [
        ("year","11-12"),

        # ("instate_tuition_fees",parseFloat(row["Published in-state tuition and fees 2011-12 (IC2011_AY)"])),

        # ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2011 (EF2011D)"])),
        # ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2011 (EF2011D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2011-12 (DRVIC2011)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2011-12 (DRVIC2011)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2011-12 (DRVIC2011)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2011-12 (DRVIC2011)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2011-12 (DRVIC2011)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2011-12 (DRVIC2011)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded Pell grants (SFA1112)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",parseFloat(row["Average amount of Pell grant aid awarded to full-time first-time undergraduates (SFA1112)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded Pell grants (SFA1112)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Percent of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1112)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",parseFloat(row["Average amount of federal  state  local or institutional grant aid awarded (SFA1112)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Number of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1112)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded federal student loans (SFA1112)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",parseFloat(row["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1112)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded federal student loans (SFA1112)"])),

        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2011-12 (SFA1112)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2011-12 (SFA1112) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2011-12 (SFA1112) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2011-12 (SFA1112) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2011-12 (SFA1112) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2011-12 (SFA1112) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2011-12 (SFA1112) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2011-12 (SFA1112) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2011-12 (SFA1112) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2011-12 (SFA1112) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2011-12 (SFA1112) - privateforprofit"])),
    ]

    years_list_10_11 = [
        ("year","10-11"),

        # ("instate_tuition_fees",parseFloat(row["Published in-state tuition and fees 2010-11 (IC2010_AY)"])),

        # ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2010 (EF2010D)"])),
        # ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2010 (EF2010D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2010-11 (DRVIC2010)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2010-11 (DRVIC2010)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2010-11 (DRVIC2010)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2010-11 (DRVIC2010)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2010-11 (DRVIC2010)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2010-11 (DRVIC2010)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded Pell grants (SFA1011)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",parseFloat(row["Average amount of Pell grant aid awarded to full-time first-time undergraduates (SFA1011)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded Pell grants (SFA1011)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Percent of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1011)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",parseFloat(row["Average amount of federal  state  local or institutional grant aid awarded (SFA1011)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Number of full-time first-time undergraduates awarded federal  state  local or institutional grant aid (SFA1011)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates awarded federal student loans (SFA1011)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",parseFloat(row["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1011)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates awarded federal student loans (SFA1011)"])),

        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students awarded Title IV federal financial aid  2010-11 (SFA1011)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2010-11 (SFA1011) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2010-11 (SFA1011) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2010-11 (SFA1011) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2010-11 (SFA1011) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2010-11 (SFA1011) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2010-11 (SFA1011) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2010-11 (SFA1011) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2010-11 (SFA1011) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2010-11 (SFA1011) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2010-11 (SFA1011) - privateforprofit"]))

     ]

    years_list_09_10 = [
        ("year","09-10"),

        # ("instate_tuition_fees",parseFloat(row["Published in-state tuition and fees 2009-10 (IC2009_AY)"])),

        # ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2009 (EF2009D)"])),
        # ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2009 (EF2009D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2009-10 (DRVIC2009)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2009-10 (DRVIC2009)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2009-10 (DRVIC2009)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2009-10 (DRVIC2009)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2009-10 (DRVIC2009)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2009-10 (DRVIC2009)"])),

        # ("perc_pell_grants_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates receiving Pell grants (SFA0910)"])),
        # ("avg_amount_pell_grants_first_time_full_time_undergrad",parseFloat(row["Average amount of Pell grant aid received by full-time first-time undergraduates (SFA0910)"])),
        # ("number_pell_grants_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates receiving Pell grants (SFA0910)"])),

        # ("perc_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Percent of full-time first-time undergraduates receiving federal  state  local or institutional grant aid (SFA0910)"])),
        # ("avg_amount_other_grant_aid_first_time_full_time_undergrad",parseFloat(row["Average amount of federal  state  local or institutional grant aid received (SFA0910)"])),
        # ("number_first_time_full_time_undergrad_other_grant_aid",parseFloat(row["Number of full-time first-time undergraduates receiving federal  state  local or institutional grant aid (SFA0910)"])),

        # ("perc_federal_loans_first_time_full_time_undergrad",parseFloat(row["Percent of full-time first-time undergraduates receiving federal student loan aid (SFA0910)"])),
        # ("avg_amount_federal_loans_first_time_full_time_undergrad",parseFloat(row["Average amount of federal student loan aid received by full-time first-time undergraduates (SFA0910)"])),
        # ("number_federal_loans_first_time_full_time_undergrad",parseFloat(row["Number of full-time first-time undergraduates receiving federal student loan aid (SFA0910)"])),

        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000 )-students receiving Title IV Federal financial aid  2009-10 (SFA0910) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students receiving Title IV Federal financial aid  2009-10 (SFA0910)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2009-10 (SFA0910) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2009-10 (SFA0910) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2009-10 (SFA0910) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2009-10 (SFA0910) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2009-10 (SFA0910) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2009-10 (SFA0910) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2009-10 (SFA0910) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2009-10 (SFA0910) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2009-10 (SFA0910) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2009-10 (SFA0910) - privateforprofit"]))

     ]


    years_list_08_09 = [
        ("year","08-09"),
        # ("instate_tuition_fees",parseFloat(row["Published in-state  tuition and fees 2008-09 (IC2008_AY)"])),

        # ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2008 (EF2008D)"])),
        # ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2008 (EF2008D)"])),

        ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2008-09 (DRVIC2008)"])),
        # ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2008-09 (DRVIC2008)"])),
        ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2008-09 (DRVIC2008)"])),
        # ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2008-09 (DRVIC2008)"])),
        # ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2008-09 (DRVIC2008)"])),
        # ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2008-09 (DRVIC2008)"])),


        # ("avg_net_price_0_30000_titleiv_public",parseFloat(row["Average net price (income 0-30 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809) - public"])),
        # ("avg_net_price_30001_48000_titleiv_public",parseFloat(row["Average net price (income 30 001-48 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809) - public"])),
        # ("avg_net_price_48001_75000_titleiv_public",parseFloat(row["Average net price (income 48 001-75 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809) - public"])),
        # ("avg_net_price_75001_110000_titleiv_public",parseFloat(row["Average net price (income 75 001-110 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809) - public"])),
        # ("avg_net_price_110001_titleiv_public",parseFloat(row["Average net price (income over 110 000 )-students receiving Title IV Federal financial aid  2008-09 (SFA0809) - public"])),

        ("avg_net_price_0_30000_titleiv_privateforprofit",parseFloat(row["Average net price (income 0-30 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809)"])),
        ("avg_net_price_30001_48000_titleiv_privateforprofit",parseFloat(row["Average net price (income 30 001-48 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809)"])),
        ("avg_net_price_48001_75000_titleiv_privateforprofit",parseFloat(row["Average net price (income 48 001-75 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809)"])),
        ("avg_net_price_75001_110000_titleiv_privateforprofit",parseFloat(row["Average net price (income 75 001-110 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809)"])),
        ("avg_net_price_110001_titleiv_privateforprofit",parseFloat(row["Average net price (income over 110 000)-students receiving Title IV Federal financial aid  2008-09 (SFA0809)"])),

        # ("number_income_public_0_30000",parseFloat(row["Number in income level (0-30 000)  2008-09 (SFA0809) - public"])),
        # ("number_income_public_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2008-09 (SFA0809) - public"])),
        # ("number_income_public_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2008-09 (SFA0809) - public"])),
        # ("number_income_public_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2008-09 (SFA0809) - public"])),
        # ("number_income_public_110001",parseFloat(row["Number in income level (110 001 or more)  2008-09 (SFA0809) - public"])),

        # ("number_income_privateforprofit_0_30000",parseFloat(row["Number in income level (0-30 000)  2008-09 (SFA0809) - privateforprofit"])),
        # ("number_income_privateforprofit_30001_48000",parseFloat(row["Number in income level (30 001-48 000)  2008-09 (SFA0809) - privateforprofit"])),
        # ("number_income_privateforprofit_48001_75000",parseFloat(row["Number in income level (48 001-75 000)  2008-09 (SFA0809) - privateforprofit"])),
        # ("number_income_privateforprofit_75001_100000",parseFloat(row["Number in income level (75 001-110 000)  2008-09 (SFA0809) - privateforprofit"])),
        # ("number_income_privateforprofit_110001",parseFloat(row["Number in income level (110 001 or more)  2008-09 (SFA0809) - privateforprofit"]))

     ]

    # years_list_07_08 = [
    #     ("year","07-08"),
    #     ("instate_tuition_fees",parseFloat(row["Published in-state  tuition and fees 2007-08 (IC2007_AY)"])),

    #     ("full_time_retention_rate",parseFloat(row["Full-time retention rate  2007 (EF2007D)"])),
    #     ("part_time_retention_rate",parseFloat(row["Part-time retention rate  2007 (EF2007D)"])),

    #     ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2007-08 (DRVIC2007)"])),
    #     ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2007-08 (DRVIC2007)"])),
    #     ("price_instate_offcampus_nofamily",parseFloat(row["Total price for in-state students living off campus (not with family)  2007-08 (DRVIC2007)"])),
    #     ("price_outstate_offcampus_nofamily",parseFloat(row["Total price for out-of-state students living off campus (not with family)  2007-08 (DRVIC2007)"])),
    #     ("price_instate_offcampus_family",parseFloat(row["Total price for in-state students living off campus (with family)  2007-08 (DRVIC2007)"])),
    #     ("price_outstate_offcampus_family",parseFloat(row["Total price for out-of-state students living off campus (with family)  2007-08 (DRVIC2007)"]))

    #  ]


    # years_list_06_07 = [
    #  ("year","06-07"),
    #  ("instate_tuition_fees",parseFloat(row["Published in-state  tuition and fees 2006-07 (IC2006_AY)"])),

    #  ("price_instate_oncampus",parseFloat(row["Total price for in-state students living on campus 2006-07 (DRVIC2006)"])),
    #  ("price_outofstate_oncampus",parseFloat(row["Total price for out-of-state students living on campus 2006-07 (DRVIC2006)"])),
    #  ("price_instate_offcampus_nofamily",convertInt(row["Total price for in-state students living off campus (not with family)  2006-07 (DRVIC2006)"])),
    #  ("price_outstate_offcampus_nofamily",convertInt(row["Total price for out-of-state students living off campus (not with family)  2006-07 (DRVIC2006)"])),
    #  ("price_instate_offcampus_family",convertInt(row["Total price for in-state students living off campus (with family)  2006-07 (DRVIC2006)"])),
    #  ("price_outstate_offcampus_family",convertInt(row["Total price for out-of-state students living off campus (with family)  2006-07 (DRVIC2006)"]))


    #  ]

    institution["yearly_data"] = OrderedDict(years_list_20_21),OrderedDict(years_list_19_20),OrderedDict(years_list_18_19),OrderedDict(years_list_17_18),OrderedDict(years_list_16_17),OrderedDict(years_list_15_16),OrderedDict(years_list_14_15),OrderedDict(years_list_13_14),OrderedDict(years_list_12_13),OrderedDict(years_list_11_12),OrderedDict(years_list_10_11),OrderedDict(years_list_09_10),OrderedDict(years_list_08_09),
    # OrderedDict(years_list_07_08),OrderedDict(years_list_06_07)

    # Dump the contents of each row
    data_file = json.dumps(institution, indent=4, separators=(',', ': '))

    # write a JSON file for each one named UnitID.json
    outfile = open("./school-data-09042019/{}.json".format(row["UnitID"]),"w")
    outfile.write(data_file)
