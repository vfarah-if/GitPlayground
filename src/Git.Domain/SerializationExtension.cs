using Newtonsoft.Json;

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
                serializerSettings = new JsonSerializerSettings(){ NullValueHandling = NullValueHandling.Ignore };
            }
            return JsonConvert.SerializeObject(source, formatting, serializerSettings);

        }
    }
}
