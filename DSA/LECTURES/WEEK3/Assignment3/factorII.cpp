#include<bits/stdc++.h>
using namespace std; 
void factor(int n)
{
    for(int i =n; i>=1 ;i--)
    {
        if(n%i==0)
        {
            cout<<i<<" ";
        }
    }
}
int main()
{
    int n ; 
    cin>>n;
    factor(n);
}