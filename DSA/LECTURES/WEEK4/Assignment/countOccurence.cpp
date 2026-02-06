#include<bits/stdc++.h>
using namespace std; 
int main()
{
    int N ,X ; 
    cin>>N>>X;
    int cnt =0 ;
    vector<long long>a(N); 
    for(int i =0 ;i<N ; i++)
    {
        cin>>a[i]; 
         if(a[i] == X)
        {
            cnt++;
        }
    }
    cout<<cnt;
    return 0;
}