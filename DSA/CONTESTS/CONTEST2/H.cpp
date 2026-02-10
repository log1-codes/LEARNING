#include<iostream>
using namespace std; 
int main()
{
    int n;
    cin>>n;

    for(int x = 1; x<=n ; x++)
    {
        int count =0 ;
        for(int d =1 ; d<=x ; d++)
        {
            if(x%d ==0)
            {
                count++;
            }

        }
        if(count<=4)
        {
            cout<<x<<" ";
        }
    }
    return 0;
}