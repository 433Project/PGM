using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace PGM_Client
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Thread th = new Thread(Send);
                th.Start();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        public static void Send()
        {
            TcpClient client = null;
            client = new TcpClient();
            client.Connect("localhost", 12345);


            //string dataToSend = "";
            //dataToSend += "123";

            int dataToSend = 100;

            byte[] data;

            data = BitConverter.GetBytes(dataToSend);
            //data = Encoding.Default.GetBytes(dataToSend);

            NetworkStream writeStream = null;
            writeStream = client.GetStream();
            

            writeStream.Write(data, 0, data.Length);

            Console.ReadKey();
            /*
            while (true)
            {
                count++;
                writeStream.Write(data, 0, data.Length);

                if (count == 100000)
                {
                    Console.WriteLine("send : " + count);
                    count = 0;
                }
            }// end loop
             */
        }
    }
}
