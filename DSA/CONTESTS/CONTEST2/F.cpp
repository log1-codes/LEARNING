#include<iostream>
using namespace std; 

int main()
{
    int n;
    cin>>n ;
    bool found = false;

    for(int d = 1 ; d<=n; d++)
    {
        if(n%d == 0)
        {
            int lastDigit = d %10 ;
            if(lastDigit == 2 || lastDigit == 7)
            {
                cout<<d<< " ";
                found = true;
            }
        }
    }
    if(!found)
    {
        cout<< -1;
    }
    return 0;
}