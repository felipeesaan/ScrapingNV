#%%
import pandas as pd
import json

with open('hoteles/Top 7/Top7_.json','r', encoding="utf-8") as f:
    data = json.loads(f.read())

df = pd.json_normalize(data)

print(df)
# %%
