using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Git.Domain
{
    public static class SerializationExtension
    {
        public static string ToJson(this object source, 
            Formatting formatting = Formatting.Indented,
            JsonSerializerSettings serializerSettings = null)
        {
            if (source == null)
            {
                return null;
            }

            if (serializerSettings == null)
            {
                serializerSettings = new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                };
            }
            return JsonConvert.SerializeObject(source, formatting, serializerSettings);
        }

        public static T To<T>(this string source)
        {
            return JsonConvert.DeserializeObject<T>(source);
        }
    }
}
