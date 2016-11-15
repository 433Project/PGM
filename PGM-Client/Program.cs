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
            client.Connect("localhost", 10444);

            int[] start = { 8, 2, 3, 4, 5, 5, 5 };

            int[] dummy = { 0,2,2,2,2};
            int[] end = { 8,2,2,2,2,6,6};

            byte[] startBytes = new byte[start.Length * sizeof(int)];
            byte[] dummyBytes = new byte[dummy.Length * sizeof(int)];
            byte[] endBytes = new byte[end.Length * sizeof(int)];

            Buffer.BlockCopy(start, 0, startBytes, 0, startBytes.Length);
            
            NetworkStream writeStream = null;
            writeStream = client.GetStream();

            // send start
            writeStream.Write(startBytes, 0, startBytes.Length);

            int count = 0;
            while (true)
            {
                count++;
                writeStream.Write(dummyBytes, 0, dummyBytes.Length);

                if (count == 100000)
                {
                    Console.WriteLine("send : " + count);
                    count = 0;
                }
                if (count == 900000)
                    break;
            }// end loop
            
            //Buffer.BlockCopy(endBytes, 0, endBytes, 0, endBytes.Length);
            //writeStream.Write(endBytes, 0, endBytes.Length);
        }// end method
    }
}
