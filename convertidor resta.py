#%%
# import pandas module
import pandas as pd
import json


#%%%

with open('top8_resta/top8.json','r', encoding="utf-8") as f:
#with open('restaurantes/.json','r', encoding="utf-8") as f:
    data = json.loads(f.read())

df = pd.json_normalize(data)
#df_list = pd.DataFrame(df)

print(df)

# %%