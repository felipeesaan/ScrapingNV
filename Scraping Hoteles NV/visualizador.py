#%%
import pandas as pd
import json

#with open('hoteles/Grand Luxxe at Vidanta Nuevo Vallarta.json','r', encoding="utf-8") as f:
#with open('hoteles/Grand Velas Riviera Nayarit.json','r', encoding="utf-8") as f:
#with open('hoteles/Hard Rock Hotel Vallarta.json','r', encoding="utf-8") as f:
#with open('hoteles/Marival Distinct Luxury Residences.json','r', encoding="utf-8") as f:
#with open('hoteles/Mayan Palace at Vidanta Nuevo Vallarta.json','r', encoding="utf-8") as f:
#with open('hoteles/Samba Vallarta All Inclusive.json','r', encoding="utf-8") as f:
#with open('hoteles/Sea Garden at Vidanta Nuevo Vallarta.json','r', encoding="utf-8") as f:
#with open('hoteles/The Grand Bliss.json','r', encoding="utf-8") as f:
#with open('hoteles/Villa Del Palmar Flamingos Beach Resort & Spa Riviera Nayarit.json','r', encoding="utf-8") as f:
with open('hoteles/Villa La Estancia Beach Resort & Spa Riviera Nayarit.json','r', encoding="utf-8") as f:
#with open('hoteles/Hoteles completo.json','r', encoding="utf-8") as f:
    data = json.loads(f.read())

df = pd.json_normalize(data)

print(df)
# %%