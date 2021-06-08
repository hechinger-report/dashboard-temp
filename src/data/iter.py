import glob
import json

def abbreviator(state):
    print(state)
    return {
        "AL": "Ala.",
        "AK": "Alaska",
        "AZ": "Ariz.",
        "AR": "Ark.",
        "CA": "Calif.",
        "CO": "Colo.",
        "CT": "Conn.",
        "DE": "Del.",
        "DC": "D.C.",
        "FL": "Fla.",
        "GA": "Ga.",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Ill.",
        "IN": "Ind.",
        "IA": "Iowa",
        "KS": "Kan.",
        "KY": "Ky.",
        "LA": "La.",
        "ME": "Maine",
        "MD": "Md.",
        "MA": "Mass.",
        "MI": "Mich.",
        "MN": "Minn.",
        "MS": "Miss.",
        "MO": "Mo.",
        "MT": "Mont.",
        "NE": "Neb.",
        "NV": "Nev.",
        "NH": "N.H.",
        "NJ": "N.J.",
        "NM": "N.M.",
        "NY": "N.Y.",
        "NC": "N.C.",
        "ND": "N.D.",
        "OH": "Ohio",
        "OK": "Okla.",
        "OR": "Ore.",
        "PA": "Pa.",
        "RI": "R.I.",
        "SC": "S.C.",
        "SD": "S.D.",
        "TN": "Tenn.",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vt.",
        "VA": "Va.",
        "WA": "Wash.",
        "WV": "W.Va.",
        "WI": "Wis.",
        "WY": "Wyo.",
        "PR": "Puerto Rico"
    }.get(state, '')

for filename in glob.iglob('./school-data-09042019/*.json'):
    with open(filename, 'r+') as f:
        data = json.load(f)
        print(data)
        this_state = data.get('state','state')
        print(filename)
        data['abbreviation'] = abbreviator(this_state)
        f.seek(0)        # <--- should reset file position to the beginning.
        json.dump(data, f, indent=4)
        f.truncate()     # remove remaining part
        # with open(filename) as n:
        #     print(json.load(n))

